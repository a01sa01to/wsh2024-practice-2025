import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks';

import type { GetBookListResponse } from '@wsh-2024/schema/src/api/books/GetBookListResponse';

import { BookDetailContent } from './BookDetailContent';
import { BookEditContent } from './BookEditContent';

type Props = {
  book?: GetBookListResponse[0];
  isOpen: boolean;
  onClose: () => void;
  refetchBookList: () => void;
};

export const BookDetailModal: React.FC<Props> = ({ book, isOpen, onClose, refetchBookList }) => {
  const [isEdit, toggleIEdit] = useToggle(false);

  if (!book) return null;

  const episodeList = book.episodes;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent containerProps={{ p: 8 }} height="100%" m={0} overflowY="auto">
        <ModalCloseButton />
        <Stack height="100%" p={4}>
          {book != null && (
            isEdit ? (
              <BookEditContent book={book} onEditComplete={() => toggleIEdit()} />
            ) : (
              <BookDetailContent book={book} onCloseDialog={onClose} onEdit={() => toggleIEdit()} refetchBookList={refetchBookList} />
            )
          )}

          <Divider />

          <Flex flexGrow={1} flexShrink={1} overflow="hidden">
            {episodeList != null && (
              episodeList.length !== 0 ? (
                <TableContainer flexGrow={1} flexShrink={1} overflowY="auto">
                  <Table aria-label="エピソード一覧" variant="striped">
                    <Thead backgroundColor="white" position="sticky" top={0} zIndex={1}>
                      <Tr>
                        <Th w={120} />
                        <Th>エピソード名</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {episodeList.map((episode) => (
                        <Tr key={episode.id}>
                          <Td textAlign="center" verticalAlign="middle">
                            <Button
                              as={Link}
                              colorScheme="teal"
                              role="button"
                              to={`/admin/books/${book.id}/episodes/${episode.id}`}
                              variant="solid"
                            >
                              編集
                            </Button>
                          </Td>
                          <Td verticalAlign="middle">
                            <Text fontWeight="bold">{episode.name}</Text>
                            <Text color="gray.400" fontSize="small">
                              {episode.id}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Text align="center" flexGrow={1} flexShrink={1} pt={2}>
                  エピソードがありません
                </Text>
              )
            )}
          </Flex>

          <Flex justifyContent="flex-end">
            <Button
              as={Link}
              colorScheme="teal"
              mt={4}
              role="button"
              to={`/admin/books/${book.id}/episodes/new`}
              variant="solid"
            >
              エピソードを追加
            </Button>
          </Flex>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
