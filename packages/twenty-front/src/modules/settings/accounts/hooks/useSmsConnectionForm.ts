import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

import { t } from '@lingui/core/macro';
import { SettingsPath } from 'twenty-shared/types';
import {
  useSaveSmsAccountMutation,
  useGetConnectedSmsAccountQuery,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

import { type SmsAccount } from '@/settings/accounts/types/SmsAccount';
import {
  connectionSms,
  type ConnectionSmsFormData,
} from '@/settings/accounts/validation-schemas/connectionSms';
import { ApolloError } from '@apollo/client';
import { isDefined } from 'twenty-shared/utils';
import { GET_CONNECTED_SMS_ACCOUNT } from '@/settings/accounts/graphql/queries/getConnectedSmsAccount';

type UseSmsConnectionFormProps = {
  isEditing?: boolean;
  connectedAccountId?: string;
};

export const useSmsConnectionForm = ({
  isEditing = false,
  connectedAccountId,
}: UseSmsConnectionFormProps = {}) => {
  const navigate = useNavigateSettings();
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  const formMethods = useForm<ConnectionSmsFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(connectionSms),
    defaultValues: {
      handle: '',
      apiKey: '',
      secretKey: '',
      lineNumber: '',
    },
  });

  const { handleSubmit, formState, watch, reset } = formMethods;
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const { isSubmitting } = formState;

  const { data: accountData, loading: accountLoading } =
    useGetConnectedSmsAccountQuery({
      variables: { id: connectedAccountId! },
      skip: !isEditing || !connectedAccountId,
      onCompleted: (data) => {
        if (isDefined(data?.getConnectedSmsAccount)) {
          const account = data.getConnectedSmsAccount;
          const params = account.connectionParameters;
          reset({
            handle: account.handle || '',
            apiKey: params?.apiKey || '',
            secretKey: params?.secretKey || '',
            lineNumber: params?.lineNumber || '',
          });
        }
      },
    });

  const [saveConnection, { loading: saveLoading }] =
    useSaveSmsAccountMutation();

  const watchedValues = watch();

  const isValid = useMemo(() => {
    return (
      Boolean(watchedValues.handle?.trim()) &&
      Boolean(watchedValues.apiKey?.trim()) &&
      Boolean(watchedValues.secretKey?.trim())
    );
  }, [watchedValues.handle, watchedValues.apiKey, watchedValues.secretKey]);

  const handleSave = useCallback(
    async (formValues: ConnectionSmsFormData): Promise<void> => {
      if (!currentWorkspaceMember?.id) {
        throw new Error('Workspace member ID is missing');
      }

      try {
        const { data } = await saveConnection({
          variables: {
            ...(isEditing && connectedAccountId
              ? { id: connectedAccountId }
              : {}),
            accountOwnerId: currentWorkspaceMember.id,
            handle: formValues.handle,
            connectionParameters: {
              apiKey: formValues.apiKey,
              secretKey: formValues.secretKey,
              lineNumber: formValues.lineNumber,
            },
          },
          refetchQueries: [GET_CONNECTED_SMS_ACCOUNT],
        });
        if (!isDefined(data)) return;

        const successMessage = isEditing
          ? t`SMS connection successfully updated`
          : t`SMS connection successfully created`;

        enqueueSuccessSnackBar({ message: successMessage });

        const { connectedAccountId: returnedConnectedAccountId } =
          data?.saveSmsAccount || {};

        navigate(SettingsPath.AccountsConfiguration, {
          connectedAccountId: returnedConnectedAccountId,
        });
      } catch (error) {
        enqueueErrorSnackBar({
          apolloError: error instanceof ApolloError ? error : undefined,
        });
      }
    },
    [
      currentWorkspaceMember?.id,
      saveConnection,
      isEditing,
      connectedAccountId,
      enqueueSuccessSnackBar,
      navigate,
      enqueueErrorSnackBar,
    ],
  );

  const canSave = isValid && !isSubmitting;
  const loading = accountLoading || saveLoading;

  return {
    formMethods,
    handleSave,
    handleSubmit,
    canSave,
    isSubmitting,
    loading,
    connectedAccount: accountData?.getConnectedSmsAccount,
  };
};

