import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { type Control, Controller } from 'react-hook-form';

import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';

import {
  type ConnectionSmsFormData,
} from '@/settings/accounts/validation-schemas/connectionSms';
import { H2Title } from 'twenty-ui/display';
import { Section } from 'twenty-ui/layout';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const StyledConnectionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

type SettingsAccountsSmsConnectionFormProps = {
  control: Control<ConnectionSmsFormData>;
  isEditing: boolean;
};

export const SettingsAccountsSmsConnectionForm = ({
  control,
  isEditing,
}: SettingsAccountsSmsConnectionFormProps) => {
  const { t } = useLingui();

  const getDescription = () => {
    if (isEditing) {
      return t`Update your SMS account configuration.`;
    }
    return t`Configure your SMS.ir account to send SMS messages.`;
  };

  return (
    <Section>
      <H2Title title={t`SMS Account`} description={getDescription()} />
      <StyledFormContainer>
        <Controller
          name="handle"
          control={control}
          render={({ field, fieldState }) => (
            <SettingsTextInput
              instanceId="phone-number-sms-connection-form"
              label={t`Phone Number`}
              placeholder={t`09123456789`}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <StyledConnectionSection>
          <Controller
            name="apiKey"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="api-key-sms-connection-form"
                label={t`API Key`}
                placeholder={t`Enter your SMS.ir API key`}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="secretKey"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="secret-key-sms-connection-form"
                label={t`Secret Key`}
                placeholder={t`Enter your SMS.ir secret key`}
                type="password"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="lineNumber"
            control={control}
            render={({ field, fieldState }) => (
              <SettingsTextInput
                instanceId="line-number-sms-connection-form"
                label={t`Line Number (Optional)`}
                placeholder={t`Enter your line number`}
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </StyledConnectionSection>
      </StyledFormContainer>
    </Section>
  );
};

