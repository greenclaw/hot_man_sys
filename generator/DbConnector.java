
import org.fluttercode.datafactory.impl.DataFactory;

import java.io.*;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;

/**
 * Created by rom on 13.11.16.
 */
public class DbConnector {

    Connection connection = null;

    public void connect(String url) throws SQLException {
        System.out.println("-------- PostgreSQL "
                + "JDBC Connection Testing ------------");

        try {

            Class.forName("org.postgresql.Driver");

        } catch (ClassNotFoundException e) {

            System.out.println("Where is your PostgreSQL JDBC Driver? "
                    + "Include in your library path!");
            e.printStackTrace();
            return;

        }

        System.out.println("PostgreSQL JDBC Driver Registered!");

        try {

            connection = DriverManager.getConnection(url);

        } catch (SQLException e) {

            System.out.println("Connection Failed! Check output console");
            e.printStackTrace();
            return;

        }

        if (connection != null) {
            System.out.println("You made it, take control your database now!");
        } else {
            System.out.println("Failed to make connection!");
        }
    }

    public void close() {
        try {
            connection.close();
        } catch (SQLException e) {
            System.out.println("Close connection Failed!");
            e.printStackTrace();
            return;
        }
    }

//    public void generateHotels() throws IOException {
//        Statement stmt = null;
//        Statement stmt2 = null;
//        Statement stmt3 = null;
//        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("managers.csv")));
//        try {
//            DataFactory df = new DataFactory();
//            stmt3 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
//            ResultSet hs = stmt3.executeQuery("select * from hotels;");
////                stmt2 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
////
////                ResultSet os = stmt2.executeQuery("select * from owners;");
//            Random rand = new Random();
//            while(hs.next()) {
//
//                    String name = df.getFirstName();
//                    String last = df.getLastName();
//
//                    String line = name + ","
//                            + last + ","
//                            + hs.getInt("id") + ","
//                            + ((rand.nextInt(10) + 5)*100 + (rand.nextInt(3))*50 +2000) + ","
//                            + name +df.getRandomText(rand.nextInt(2) + 1)+  last + df.getNumberText(rand.nextInt(2) + 1) +","
//                            + df.getEmailAddress() + ","
//                            + df.getRandomText(rand.nextInt(4) + 6) + ","
//                            + df.getNumberText(12) +"\n";
//                    System.out.print(line);
//                    writer.write(line);
//                }
//    } catch (SQLException e) {
//            e.printStackTrace();
//        } finally {
//            writer.close();
//            if (stmt!=null)
//                try {
//                    stmt.close();
//                    stmt2.close();
//                    stmt3.close();
////                        writer.close();
//                    //    stmt2.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//        }
//    }

    public void generateHotelsOwners() throws IOException {
            Statement stmt = null;
            Statement stmt2 = null;
            Statement stmt3 = null;
            BufferedWriter writer = new BufferedWriter(new FileWriter(new File("owners.csv")));
        BufferedWriter writer2 = new BufferedWriter(new FileWriter(new File("owners_hotels.csv")));
        try {
                DataFactory df = new DataFactory();
                stmt3 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
                ResultSet hs = stmt3.executeQuery("select * from hotels;");
            SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");
//                stmt2 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
//                ResultSet os = stmt2.executeQuery("select * from owners;");
                Random rand = new Random();
                for (int i = 1; i < 1027 && hs.next(); i++){


                    String name = df.getFirstName();
                    String last = df.getLastName();

                    Calendar cla = GregorianCalendar.getInstance();
                    cla.setTime(df.getBirthDate());
                    String ow = name + ","
                            + last + ","
                            + sd.format(cla.getTime()) + ","
                            + df.getNumberText(10) + ","
                            + name +df.getRandomText(rand.nextInt(2) + 1)+  last + df.getNumberText(rand.nextInt(2) + 1) +","
                            + df.getEmailAddress() + ","
                            + df.getRandomText(rand.nextInt(4) + 6) +"\n";
                    System.out.print(ow);
                    writer.write(ow);
                    int hotelNumber = rand.nextInt(3) + rand.nextInt(2);
                    do {
                        hotelNumber--;

                        String line = hs.getInt("id") + ","
                                + i + "\n";

                        System.out.print(line);

                        writer2.write(line);
                    } while(hotelNumber > 0 && hs.next());

                }

            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                writer.close();
            writer2.close();
                if (stmt!=null)
                    try {
                        stmt.close();
                        stmt2.close();
                        stmt3.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
            }
        }

        public void generateStaff() throws IOException {
            Statement stmt = null;
            Statement stmt2 = null;
            Statement stmt1 = null;
            SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");

            BufferedWriter writer = new BufferedWriter(new FileWriter(new File("staff.csv")));
            try {
                stmt1 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
                ResultSet rs = stmt1.executeQuery("select * from hotels;");
                Random rand = new Random();
                DataFactory df = new DataFactory();


                int count = 1;
                while (rs.next() ) {
                    int j = rs.getInt("id");
                    int salary = (rand.nextInt(5) + 1 + (int)rs.getDouble("star_num")) * 50 + 1000;
                    int m = //rand.nextInt(10) + 3;
                            rand.nextInt(5) *(int)rs.getDouble("star_num") + rand.nextInt(4) + 1;
                    for(int i = 0; i < m; i++) {

                        Calendar cla = GregorianCalendar.getInstance();
                        cla.setTime(df.getBirthDate());
                        String query = df.getFirstName() + ","
                                + df.getLastName() +"," + df.getNumberText(10) +","
                                + sd.format(cla.getTime())+"," +
                                + j + "," + salary + "\n";


                        System.out.print(query);
                        writer.write(query);
                    }



//                    stmt2 = connection.createStatement();
//                    stmt2.execute(query);
                }

            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                if (stmt!=null)
                    try {
                        stmt.close();
                        stmt1.close();
                        writer.close();
    //                    stmt2.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
            }
        }

    public void generateRooms() throws IOException {
        Statement stmt = null;
        Statement stmt2 = null;
        Statement stmt1 = null;
        SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");

        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("rooms.csv")));
        try {
            stmt1 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = stmt1.executeQuery("select * from hotels;");
            Random rand = new Random();
            DataFactory df = new DataFactory();


            int count = 1;
            while (rs.next() ) {
                int j = rs.getInt("id");
                int salary = (rand.nextInt(5) + 1 + (int)rs.getDouble("star_num")) * 50 + 1000;
                int m = 200;
                for(int i = 1; i <= m; i++) {


                    String query =
                            + j +"," + i +","
//                            + sd.format(cla.getTime())+"," +
                            + (rand.nextInt(6) + 1) + "," + (rand.nextInt(6) + rand.nextInt(4)*rand.nextInt(3)  +1) + "\n";


                    System.out.print(query);
                        writer.write(query);
                }



//                    stmt2 = connection.createStatement();
//                    stmt2.execute(query);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (stmt!=null)
                try {
                    stmt.close();
                    stmt1.close();
                        writer.close();
                    //                    stmt2.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
        }
    }


    public void generateManagers() throws IOException {
        Statement stmt = null;
        Statement stmt2 = null;
        Statement stmt1 = null;
        SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");

        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("managers.csv")));
        try {
            stmt1 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = stmt1.executeQuery("select * from hotels;");
            Random rand = new Random();
            DataFactory df = new DataFactory();


            int count = 1;
            while (rs.next() ) {
                int j = rs.getInt("id");
                int n = 0;
                int salary = (rand.nextInt(10) + rand.nextInt(10)) * 100 + 2000;

                String name = df.getFirstName();
                String last = df.getLastName();

                Calendar cla = GregorianCalendar.getInstance();
                cla.setTime(df.getBirthDate());
                String ow = name + ","
                        + last + ","
                        + sd.format(cla.getTime()) + ","
                        + df.getNumberText(10) + ","
                        + name +df.getRandomText(rand.nextInt(2) + 1)+  last + df.getNumberText(rand.nextInt(2) + 1) +","
                        + df.getEmailAddress() + ","
                        + df.getRandomText(rand.nextInt(4) + 6) +","
                        + j + "," +
                        + salary+ "\n";

                System.out.println(ow);
                writer.write(ow);

//                writer.write(query);
//                    stmt2 = connection.createStatement();
//                    stmt2.execute(query);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            writer.close();
            if (stmt!=null)
                try {
                    stmt.close();
                    stmt1.close();

                    //           stmt2.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
        }
    }



//    public void generatePrices() throws IOException {
//        Statement stmt = null;
//        Statement stmt2 = null;
//        Statement stmt1 = null;
//        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("prices.csv")));
//        try {
//            stmt1 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
//            ResultSet rs = stmt1.executeQuery("select * from hotels;");
//            Random rand = new Random();
//            DataFactory df = new DataFactory();
//
//            while (rs.next()) {
//                int s= rand.nextInt(3) + 1;
//                for (int i = rand.nextInt(6) + 1; i < 7; i+= s) {
//
//                    int j = rs.getInt("id");
//                    int star = rs.getInt("stars");
//
//                    String query = j + ","
//                            + i + ","
//                            + (rand.nextInt(5) + 0.5 * i + 0.3 * star) + "\n";
//
//                    System.out.print(query);
////                    writer.write(query);
////                    stmt2 = connection.createStatement();
////                    stmt2.execute(query);
//                }
//
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        } finally {
//            if (stmt!=null)
//                try {
//                    stmt.close();
//                    stmt1.close();
//                    writer.close();
////                    stmt2.close();
//                } catch (SQLException e) {
//                    e.printStackTrace();
//                }
//        }
//
//    }
//
    public void generateReservations() throws IOException {
        Statement stmt = null;
        Statement stmt2 = null;
        Statement stmt1 = null;
        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("reservations.csv")));
        try {
            stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = stmt.executeQuery("select * from rooms;");
            stmt1 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs1 = stmt1.executeQuery("select * from guests;");
            Random rand = new Random();
            int count = 1;
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd");
            while (count < 10000) {
                rs.next();
                rs.absolute(rand.nextInt(1027) + 644);
                int i = rs.getInt("id");

                int m = 10;
                int d = 18;
                int y = 2016;
                Calendar arrive = new GregorianCalendar(y, m, d, 0, 0, 0);
                Calendar departure;
                while (true) {
                    rs1.absolute(rand.nextInt(10) + 1);
                    int j = rs1.getInt("id");

                    int h = rand.nextInt(24); int mi = rand.nextInt(60); int sec = rand.nextInt(60);
                    arrive.add(Calendar.DAY_OF_YEAR, rand.nextInt(4));
                    departure = (GregorianCalendar)arrive.clone();
                    departure.add(Calendar.DAY_OF_YEAR, rand.nextInt(8) + rand.nextInt(7) + 1);
                    if (departure.get(Calendar.YEAR) > 2016
                            && departure.get(Calendar.MONTH) > 3) {
                        break;
                    }
                    Calendar currentCal = (GregorianCalendar)arrive.clone();
                    currentCal.add(Calendar.DAY_OF_YEAR, rand.nextInt(30) - 30);
                    currentCal.add(Calendar.HOUR, h);
                    currentCal.add(Calendar.MINUTE, mi);
                    currentCal.add(Calendar.SECOND, sec);

                    String status;
                    String reserve = sdf.format(currentCal.getTimeInMillis());
                    int success = rand.nextInt(4) - 2;
                    switch (success) {
                        case 1: {
                            status = "Confirmed";
                            break;
                        }
                        case 0: {
                            status = "Paid";
                            break;
                        }
                        default: {
                            status = "Awaiting";
                            break;
                        }

                    }

                    String query =
                            j + ","
                            + i + ","
                            + reserve + ","
                            + status + ","
                            + sd.format(arrive.getTime()) + ","
                            + sd.format(departure.getTime()) + "\n";

                    d += rand.nextInt(5);
                    System.out.print(query);
                    writer.write(query);
//                    stmt2 = connection.createStatement();
//                    stmt2.execute(query);
                    count++;
                }

            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (stmt!=null)
                try {
                    stmt.close();
                    stmt1.close();
                    writer.close();
//                    stmt2.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
        }

    }


    public  void generateLog() throws IOException {
        Statement stmt = null;
        Statement stmt2 = null;
        Statement stmt1 = null;
        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("logs.csv")));
        try {
            stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = stmt.executeQuery("select * from rooms;");
            stmt1 = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs1 = stmt1.executeQuery("select * from guests;");
            Random rand = new Random();
            int count = 1;
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            while (count < 800000) {
                rs.next();
//                rs1.absolute(rand.nextInt(42701) + 1);
                int i = rs.getInt("id");

                int m = 9;
                int d = 1;
                int y = 2014;

                while (count < 800000) {
                    rs1.absolute(rand.nextInt(1027) + 1);
                    int j = rs1.getInt("id");
                    if (d > 30) {
                        if (d > 28 && m ==2) d %=28;
                        else d %= 30;
                        m++;
                    }
                    if (m > 12) {
                        m = 1;
                        d = 1;
                        y++;
                    }
                    if (m > 10 && y == 2016) break;
                    String mMonth = m < 10? "0" + Integer.toString(m): Integer.toString(m);
                    String mDay = d < 10? "0" + Integer.toString(d): Integer.toString(d);
                    String mYear = Integer.toString(y);
                    int h = rand.nextInt(24); int mi = rand.nextInt(60); int sec = rand.nextInt(60);
                    Calendar arriveCal = new GregorianCalendar(y, m, d, h, mi, sec);
                    h = rand.nextInt(24); mi = rand.nextInt(60); sec = rand.nextInt(60);
                    Calendar currentCal = new GregorianCalendar(y, m, d, h, mi, sec);
                    currentCal.add(Calendar.DAY_OF_WEEK, (-rand.nextInt(14) - 1));
                    d += rand.nextInt(5) + rand.nextInt(8);
                    if (d > 30) d %= 30;
                    if (d > 28 && m ==2) d %=28;

                    m++;
                    if (m > 12) {
                        m = 1;
                        d = 1;
                        y++;
                    }
                    if (m > 10 && y == 2016)
                        break;

                    String mYear2 = Integer.toString(y);
                    String mMonth2 = m < 10? "0" + Integer.toString(m): Integer.toString(m);
                    String mDay2 = d < 10? "0" + Integer.toString(d): Integer.toString(d);
                    String arrive = mYear+"-" +mMonth +"-"+mDay ;
                    String departure = mYear2+"-" +mMonth2 +"-"+mDay2;
                    String current = sdf.format(currentCal.getTimeInMillis());
                    String status;
                    String log;
                    int success = rand.nextInt(4) - 2;
                    switch (success) {
                        case 1: {
                            status = "Not confirmed";
                            log = arrive + " 12:00:00";
                            break;
                        }
                        case 0: {
                            status = "Aborted by guest";
                            log = sdf.format(
                                    arriveCal.getTimeInMillis() +
                                            (rand.nextLong() %
                                                    (arriveCal.getTimeInMillis() - currentCal.getTimeInMillis()+ 1) )) ;
                            break;
                        }
                        default: {
                            status = "Successful";
                            log = departure + " 12:00:00";
                            break;
                        }

                    }

                    String query = i + ","
                            + j + ","
                            + log + ","
                            + current + ","
                            + status + ","
                            + arrive + ","
                            + departure + "\n";

                    d += rand.nextInt(5);
                    System.out.print(query);
                    writer.write(query);
//                    stmt2 = connection.createStatement();
//                    stmt2.execute(query);
                    count++;
                }

            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (stmt!=null)
                try {
                    stmt.close();
                    stmt1.close();
                    writer.close();
//                    stmt2.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
        }
    }

}

