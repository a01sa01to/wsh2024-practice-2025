import styled from 'styled-components';

const _Wrapper = styled.div`
  width: 100%;
`;

const _Separator = styled.img`
  display: block;
  width: 100%;
  height: 1px;
`;

export const Separator: React.FC = () => {
  const imgUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjuHz5cj0AB+8C+UyZ3vUAAAAASUVORK5CYII=';
  return (
    <_Wrapper>
      <_Separator aria-hidden={true} height={1} src={imgUrl} width="100%" />
    </_Wrapper>
  );
};
