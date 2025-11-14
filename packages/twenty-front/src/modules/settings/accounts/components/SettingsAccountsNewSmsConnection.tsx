import { useLingui } from '@lingui/react/macro';
import { FormProvider } from 'react-hook-form';

import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'twenty-shared/types';

import { getSettingsPath } from 'twenty-shared/utils';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

import { SettingsAccountsSmsConnectionForm } from '@/settings/accounts/components/SettingsAccountsSmsConnectionForm';
import { useSmsConnectionForm } from '../hooks/useSmsConnectionForm';
import { type ConnectionSmsFormData } from '../validation-schemas/connectionSms';

export const SettingsAccountsNewSmsConnection = () => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();

  const {
    formMethods,
    handleSave,
    handleSubmit,
    canSave,
    isSubmitting,
    loading,
  } = useSmsConnectionForm({});

  const { control } = formMethods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formMethods}>
      <SubMenuTopBarContainer
        title={t`New SMS Account`}
        links={[
          {
            children: t`User`,
            href: getSettingsPath(SettingsPath.ProfilePage),
          },
          {
            children: t`Accounts`,
            href: getSettingsPath(SettingsPath.Accounts),
          },
          { children: t`New SMS Account` },
        ]}
        actionButton={
          <SaveAndCancelButtons
            isSaveDisabled={!canSave}
            isCancelDisabled={isSubmitting}
            isLoading={loading}
            onCancel={() => navigate(SettingsPath.Accounts)}
            onSave={handleSubmit((data: ConnectionSmsFormData) => handleSave(data))}
          />
        }
      >
        <SettingsPageContainer>
          <SettingsAccountsSmsConnectionForm control={control} isEditing={false} />
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    </FormProvider>
  );
};

