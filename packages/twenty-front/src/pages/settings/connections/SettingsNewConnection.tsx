import { SettingsConnectionTypeProviderForm } from '@/settings/accounts/components/SettingsConnectionTypeProviderForm';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';

export const SettingsNewConnection = () => {
  return (
    <SubMenuTopBarContainer
      title={t`Add Connection`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: t`Connections`,
          href: getSettingsPath(SettingsPath.Connections),
        },
        { children: t`Add` },
      ]}
    >
      <SettingsPageContainer>
        <SettingsConnectionTypeProviderForm />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

