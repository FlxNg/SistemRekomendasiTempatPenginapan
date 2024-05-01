export class CommonConstant {
    // Mode List
    public static MainMenu = "MainMenu";
    public static SistemRekomendasi = "SistemRekomendasi";
    public static Setting = "Setting";
    public static Result = "Result";
    public static AdminLogin = "AdminLogin";
    public static AdminMain = "AdminMain";

    // Localstorage Key
    public static KeyWeight = "Weight";
    public static KeyHistory = "History";

    // Cookie Key
    public static KeyAdmin = "Admin";

    // Weight Setting Behavior
    public static INC = "INC"; // Increase
    public static DCR = "DCR"; // Decrease

    // Confirmation
    public static SETTING_CHANGED = "Terdapat perubahan pada setting bobot kriteria. Setting yang tidak disave akan hilang, apakah tetap lanjut?"
    public static CONFIRM_RESET = "Bobot kriteria akan dikembalikan ke nilai default. Apakah anda yakin untuk lanjut?"
    public static CONFIRM_SAVE = "Lanjut untuk menyimpan pengaturan nilai Bobot Kriteria?";
    public static CONFIRM_RESET_TEMPAT_PENGINAPAN = "Seluruh tempat penginapan yang telah diinput akan dihapus. Apakah anda yakin untuk lanjut?";
    public static CONFIRM_HAPUS_TEMPAT_PENGINAPAN = "Lanjut untuk menghapus tempat penginapan ";
    public static CONFIRM_CALCULATE_TOPSIS = "Lanjut kalkulasi rekomendasi menggunakan data yang telah diinput?"
    public static CONFIRM_ADMIN_LOGOUT = "Konfirmasi untuk logout sebagai admin?";

    // Form Type Handler Mode
    public static Add = "Add";
    public static Edit = "Edit";
    public static Delete = "Delete";

    // Authentication
    public static FailedAPI = {
        StatusCode: "500",
        Message: "Failed to hit API"
    }

    public static SuccessAPI = {
        StatusCode: "200",
        Message: "Success"
    }

    // Daftar Daerah
    public static ListDaerah: string[] = ["Bali", "DKI Jakarta", "Jawa Timur", "Jawa Barat", "DI Yogyakarta"];

    // Daftar Tipe Tempat Penginapan
    public static ListJenis: string[] = ["Hotel", "Villa", "Apartment"]
}