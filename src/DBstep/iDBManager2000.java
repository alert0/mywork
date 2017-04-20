package DBstep;

import java.io.PrintStream;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class iDBManager2000
{
  public String ClassString = null;
  public String ConnectionString = null;
  public String UserName = null;
  public String PassWord = null;
  public Connection Conn;
  public Statement Stmt;

  public iDBManager2000()
  {
    this.ClassString = "com.microsoft.jdbc.sqlserver.SQLServerDriver";
    this.ConnectionString = "jdbc:microsoft:sqlserver://127.0.0.1:1433;DatabaseName=DBDemo;User=dbdemo;Password=dbdemo";
    this.UserName = "dbdemo";
    this.PassWord = "dbdemo";
  }

  public boolean OpenConnection()
  {
    boolean mResult = true;
    try
    {
      Class.forName(this.ClassString);
      if ((this.UserName == null) && (this.PassWord == null))
      {
        this.Conn = DriverManager.getConnection(this.ConnectionString);
      }
      else
      {
        this.Conn = DriverManager.getConnection(this.ConnectionString, this.UserName, this.PassWord);
      }

      this.Stmt = this.Conn.createStatement();
      mResult = true;
    }
    catch (Exception e)
    {
      System.out.println(e.toString());
      mResult = false;
    }
    return mResult;
  }

  public void CloseConnection()
  {
    try
    {
      this.Stmt.close();
      this.Conn.close();
    }
    catch (Exception e)
    {
      System.out.println(e.toString());
    }
  }

  public String GetDateTime() {
    Calendar cal = Calendar.getInstance();
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String mDateTime = formatter.format(cal.getTime());
    return mDateTime;
  }

  public Date GetDate()
  {
    Calendar cal = Calendar.getInstance();
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
    String mDateTime = formatter.format(cal.getTime());
    return Date.valueOf(mDateTime);
  }

  public int GetMaxID(String vTableName, String vFieldName)
  {
    int mResult = 0;
    String mSql = new String();
    mSql = String.valueOf(String.valueOf(new StringBuffer("select max(").append(vFieldName).append(")+1 as MaxID from ").append(vTableName)));
    if (OpenConnection())
    {
      try
      {
        ResultSet result = ExecuteQuery(mSql);
        if (result.next())
        {
          mResult = result.getInt("MaxID");
        }
        result.close();
      }
      catch (Exception e)
      {
        System.out.println(e.toString());
      }
      CloseConnection();
    }
    return mResult;
  }

  public ResultSet ExecuteQuery(String SqlString)
  {
    ResultSet result = null;
    try
    {
      result = this.Stmt.executeQuery(SqlString);
    }
    catch (Exception e)
    {
      System.out.println(e.toString());
    }
    return result;
  }

  public int ExecuteUpdate(String SqlString)
  {
    int result = 0;
    try
    {
      result = this.Stmt.executeUpdate(SqlString);
    }
    catch (Exception e)
    {
      System.out.println(e.toString());
    }
    return result;
  }
}