import java.io.IOException;
import java.sql.SQLException;

/**
 * Created by rom on 13.11.16.
 */
public class Main {

    public static void main(String args[]) throws SQLException, IOException {
        String url= "jdbc:postgresql://localhost:5432/hot_man_sys?user=hot_man_sys&password=hot_man_sys";
        DbConnector conn = new DbConnector();
        conn.connect(url);

//        conn.generateHotelsOwners();
//        conn.generateStaff();
//        conn.generateRooms();
//        conn.generateManagers();
//        conn.generateReservations();
        conn.generateLog();
        conn.close();
    }
}

