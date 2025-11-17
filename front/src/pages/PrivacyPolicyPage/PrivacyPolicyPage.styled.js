import styled from 'styled-components';

export const PolicyContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[12]} ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[8]} ${props => props.theme.spacing[4]};
  }
`;

export const PolicyHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[12]};
  padding-bottom: ${props => props.theme.spacing[8]};
  border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
`;

export const PolicyTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['4xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size['3xl']};
  }
`;

export const PolicySubtitle = styled.p`
  font-size: ${props => props.theme.fonts.size.lg};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const PolicyDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[500]};
  margin-top: ${props => props.theme.spacing[4]};
`;

export const PolicyContent = styled.div`
  color: ${props => props.theme.colors.gray[800]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;

export const PolicyIntro = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[10]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};
  border-left: 4px solid ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.md};
`;

export const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing[10]};
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[3]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const SubsectionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[800]};
  margin: ${props => props.theme.spacing[6]} 0 ${props => props.theme.spacing[4]};
`;

export const SubsectionSubtitle = styled.h4`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[700]};
  margin: ${props => props.theme.spacing[4]} 0 ${props => props.theme.spacing[3]};
`;

export const Paragraph = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${props => props.theme.spacing[4]} 0;
`;

export const ListItem = styled.li`
  font-size: ${props => props.theme.fonts.size.base};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[3]};
  padding-left: ${props => props.theme.spacing[6]};
  position: relative;

  &:before {
    content: '•';
    position: absolute;
    left: ${props => props.theme.spacing[2]};
    color: ${props => props.theme.colors.primary[500]};
    font-weight: ${props => props.theme.fonts.weight.bold};
  }
`;

export const ContactBox = styled.div`
  background: ${props => props.theme.colors.primary[50]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin: ${props => props.theme.spacing[6]} 0;
`;

export const ContactTitle = styled.h4`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const ContactInfo = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[700]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};

  p {
    margin: ${props => props.theme.spacing[2]} 0;
  }

  a {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ExternalLinks = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.primary[200]};
`;

export const ExternalLinkItem = styled.div`
  margin-bottom: ${props => props.theme.spacing[2]};

  a {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: ${props => props.theme.spacing[2]};

    &:hover {
      text-decoration: underline;
    }
  }
`;
