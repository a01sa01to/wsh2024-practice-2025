import { Link as LLink } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  to?: string;
} & Omit<JSX.IntrinsicElements['a'], 'ref'>;

export const Link: React.FC<Props> = ({ children, href, to, ...rest }) => {
  return (
    <LLink to={to ?? href ?? ''} {...rest}>
      {children}
    </LLink>
  );
};
