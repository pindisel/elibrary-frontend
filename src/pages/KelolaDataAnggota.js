import React, { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Button,
} from "@mui/material";
import { FiTrash2, FiEdit } from "react-icons/fi";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { AddEditModal } from "../components";
import { UserService } from "../services/UserService";

const KelolaData = () => {
  const deleteBook = async (id) => {
    try {
      await fetch(`https://elibrary-back.herokuapp.com/buku/${id}`, {
        method: "DELETE",
      });
      window.location = "/kelola-data";
    } catch (err) {
      console.error(err.message);
    }
  };

  //Input Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataModal, setDataModal] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBuku = async () => {
      const response = await UserService.getBooks();
      const data = response.data;
      setBooks(data);
    };

    fetchBuku();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - books.length) : 0;

  return (
    <>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Master Data
      </Typography>
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        style={{
          color: "#6F8197",
        }}
      >
        Data Anggota
      </Typography>
      <Button
        variant="contained"
        color="green"
        startIcon={<AddBoxIcon />}
        sx={{
          mt: 5,
        }}
        style={{ borderRadius: 10 }}
        onClick={() => {
          handleOpen();
        }}
      >
        <Typography variant="subtitle1">Tambah Anggota</Typography>
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" width={50}>
                No
              </TableCell>
              <TableCell align="center" width={100}>
                Id Anggota
              </TableCell>
              <TableCell align="center" width={200}>
                Nama Anggota
              </TableCell>
              <TableCell align="center" width={200}>
                Username
              </TableCell>
              <TableCell align="center" width={200}>
                Level Anggota
              </TableCell>
              <TableCell align="center" width={50}>
                Jenis Kelamin
              </TableCell>
              <TableCell align="center" width={150}>
                Kelola
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell align="center">
                    {page * rowsPerPage + (index + 1)}
                  </TableCell>
                  <TableCell align="center">{data.idbuku}</TableCell>
                  <TableCell align="center">{data.judul}</TableCell>
                  <TableCell align="center">{data.pengarang}</TableCell>
                  <TableCell align="center">{data.penerbit}</TableCell>
                  <TableCell align="center">{data.tahun}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="green"
                      onClick={() => {
                        setDataModal(data);
                        handleOpen();
                      }}
                    >
                      <FiEdit />
                    </IconButton>

                    <IconButton
                      onClick={() => deleteBook(data.id)}
                      color="error"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            <AddEditModal
              open={open}
              handleClose={() => handleClose()}
              datas={dataModal}
            />
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 73 * emptyRows,
                }}
              >
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={books.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 25]}
      />
    </>
  );
};

export default KelolaData;
