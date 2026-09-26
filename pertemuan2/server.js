const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Koneksi ke MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ree123",
    database: "absensi"
});

// Cek koneksi MySQL
db.connect((err) => {
    if (err) {
        console.error("Gagal terhubung ke MySQL!");
        console.error(err.message);
        return;
    }

    console.log("Berhasil terhubung ke MySQL!");
});

// ===============================
// GET - Mengambil semua data
// ===============================
app.get("/absensi", (req, res) => {

    const sql = `
        SELECT id, nama, nim, status, tanggal
        FROM mahasiswa
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Error mengambil data:", err);

            return res.status(500).json({
                message: "Gagal mengambil data absensi"
            });
        }

        res.json(results);
    });
});

// ===============================
// POST - Menambahkan data
// ===============================
app.post("/absensi", (req, res) => {

    const { nama, nim, status } = req.body;

    // Cek data
    if (!nama || !nim || !status) {

        return res.status(400).json({
            message: "Nama, NIM, dan status harus diisi!"
        });
    }

    const sql = `
        INSERT INTO mahasiswa (nama, nim, status)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [nama, nim, status],
        (err, result) => {

            if (err) {
                console.error("Error menambahkan data:", err);

                return res.status(500).json({
                    message: "Gagal menyimpan data absensi"
                });
            }

            console.log(
                "Data berhasil ditambahkan. ID:",
                result.insertId
            );

            res.json({
                message: "Data absensi berhasil ditambahkan!",
                id: result.insertId
            });
        }
    );
});

// ===============================
// DELETE - Menghapus data
// ===============================
app.delete("/absensi/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM mahasiswa
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Error menghapus data:", err);

            return res.status(500).json({
                message: "Gagal menghapus data absensi"
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }

        res.json({
            message: "Data absensi berhasil dihapus!"
        });
    });
});

// ===============================
// Menjalankan server
// ===============================
app.listen(PORT, () => {

    console.log("----------------------------------");
    console.log("Server Absensi berjalan!");
    console.log(`http://localhost:${PORT}`);
    console.log("----------------------------------");

});