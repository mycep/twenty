import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'twenty-shared/types';
import { IconPlus } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

const StyledEmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(4)};
  text-align: center;
`;

const StyledMessage = styled.p`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.md};
  margin: 0;
`;

export const SettingsConnectionsEmptyStateCard = () => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();

  return (
    <StyledEmptyStateContainer>
      <StyledMessage>
        {t`You do not have any connections to other systems yet.`}
      </StyledMessage>
      <Button
        Icon={IconPlus}
        title={t`Add`}
        variant="primary"
        onClick={() => navigate(SettingsPath.NewConnection)}
      />
    </StyledEmptyStateContainer>
  );
};

