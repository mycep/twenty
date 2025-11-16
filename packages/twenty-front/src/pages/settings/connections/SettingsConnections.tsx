import { type ConnectedAccount } from '@/accounts/types/ConnectedAccount';
import { MessageChannelSyncStage } from '@/accounts/types/MessageChannel';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useGenerateDepthRecordGqlFieldsFromObject } from '@/object-record/graphql/record-gql-fields/hooks/useGenerateDepthRecordGqlFieldsFromObject';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SettingsConnectionsEmptyStateCard } from '@/settings/connections/components/SettingsConnectionsEmptyStateCard';
import { SettingsConnectionsListCard } from '@/settings/connections/components/SettingsConnectionsListCard';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useLingui } from '@lingui/react/macro';
import { useRecoilValue } from 'recoil';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import { H2Title } from 'twenty-ui/display';
import { Section } from 'twenty-ui/layout';

export const SettingsConnections = () => {
  const { t } = useLingui();
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  const { recordGqlFields } = useGenerateDepthRecordGqlFieldsFromObject({
    objectNameSingular: CoreObjectNameSingular.ConnectedAccount,
    depth: 1,
    shouldOnlyLoadRelationIdentifiers: false,
  });

  const { records: allAccounts, loading } =
    useFindManyRecords<ConnectedAccount>({
      objectNameSingular: CoreObjectNameSingular.ConnectedAccount,
      filter: {
        accountOwnerId: {
          eq: currentWorkspaceMember?.id,
        },
      },
      recordGqlFields,
    });

  const accountsToShow = allAccounts.filter((account) => {
    return (
      account.messageChannels.length === 0 ||
      account.messageChannels.some(
        (channel) =>
          channel.syncStage !== MessageChannelSyncStage.PENDING_CONFIGURATION,
      )
    );
  });

  return (
    <SubMenuTopBarContainer
      title={t`Connections`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Connections` },
      ]}
    >
      <SettingsPageContainer>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Section>
            <H2Title
              title={t`Connections`}
              description={t`Manage your connections to other systems.`}
            />
            {accountsToShow.length === 0 ? (
              <SettingsConnectionsEmptyStateCard />
            ) : (
              <SettingsConnectionsListCard accounts={accountsToShow} />
            )}
          </Section>
        )}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};

