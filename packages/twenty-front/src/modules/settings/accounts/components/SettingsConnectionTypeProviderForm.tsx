import { Select } from '@/ui/input/components/Select';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { ConnectedAccountProvider, SettingsPath } from 'twenty-shared/types';
import { H2Title, IconArrowRight } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { useTriggerApisOAuth } from '../hooks/useTriggerApiOAuth';
import { CONNECTION_TYPES, type ConnectionProvider, type ConnectionType } from '../types/connection-types';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const SettingsConnectionTypeProviderForm = () => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();
  const { triggerApisOAuth } = useTriggerApisOAuth();
  const [selectedType, setSelectedType] = useState<ConnectionType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ConnectionProvider | null>(null);

  const selectedTypeConfig = CONNECTION_TYPES.find((config) => config.type === selectedType);
  const availableProviders = selectedTypeConfig?.providers || [];

  const handleTypeChange = (type: ConnectionType | null) => {
    setSelectedType(type || null);
    setSelectedProvider(null);
  };

  const handleProviderChange = (provider: ConnectionProvider | null) => {
    setSelectedProvider(provider || null);
  };

  const handleContinue = () => {
    if (!selectedType || !selectedProvider) return;

    switch (selectedProvider) {
      case 'sms_ir':
        navigate(SettingsPath.NewSmsConnection);
        break;
      case 'imap_smtp_caldav':
        navigate(SettingsPath.NewImapSmtpCaldavConnection);
        break;
      case 'google':
        triggerApisOAuth(ConnectedAccountProvider.GOOGLE, {
          redirectLocation: SettingsPath.Connections,
        });
        break;
      case 'microsoft':
        triggerApisOAuth(ConnectedAccountProvider.MICROSOFT, {
          redirectLocation: SettingsPath.Connections,
        });
        break;
      default:
        break;
    }
  };

  const canContinue = Boolean(selectedType && selectedProvider);

  const typeOptions = CONNECTION_TYPES.map((config) => ({
    label: config.label,
    value: config.type,
  }));

  const providerOptions = availableProviders.map((provider) => ({
    label: provider.label,
    value: provider.value,
  }));

  return (
    <Section>
      <H2Title
        title={t`Add Connection`}
        description={t`Select the type and provider for your new connection`}
      />
      <StyledFormContainer>
        <Select
          label={t`Type`}
          options={typeOptions}
          value={selectedType || null}
          onChange={handleTypeChange}
          dropdownId="connection-type-dropdown"
          emptyOption={{ label: t`Select a type`, value: null }}
        />

        {selectedType && availableProviders.length > 0 && (
          <Select
            label={t`Provider`}
            options={providerOptions}
            value={selectedProvider || null}
            onChange={handleProviderChange}
            dropdownId="connection-provider-dropdown"
            emptyOption={{ label: t`Select a provider`, value: null }}
          />
        )}

        {selectedType && availableProviders.length === 0 && (
          <SettingsTextInput
            instanceId="connection-type-not-available"
            label={t`Provider`}
            value={t`No providers available for this type yet`}
            disabled
          />
        )}

        {canContinue && (
          <StyledButtonContainer>
            <Button
              title={t`Continue`}
              Icon={IconArrowRight}
              onClick={handleContinue}
              variant="primary"
            />
          </StyledButtonContainer>
        )}
      </StyledFormContainer>
    </Section>
  );
};

