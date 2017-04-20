package DBstep;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;

public class iMsgServer2000_iWebRevision {
    private String FError;
    private int FFileSize;
    private byte[] FMsgFile;
    private String FMsgText;
    private byte[] FStream;
    private String FVersion;
    private String TableBase64;
    private String VERSION;

    public iMsgServer2000_iWebRevision() {
        this.VERSION = "DBSTEP V3.0";

        this.TableBase64 = "FxcYg3UZvtEz50Na8G476=mLDI/jVfC9dsoMAiBhJSu2qPKe+QRbXry1TnkWHlOpw";
        this.FMsgText = new String();
        this.FError = new String();
        this.FVersion = new String();
        this.FFileSize = 0;
        this.FMsgText = "";
        this.FError = "";
        this.FVersion = "DBSTEP V3.0";
    }

    public String DecodeBase64(String Value) {
        ByteArrayOutputStream o = new ByteArrayOutputStream();
        byte[] d = new byte[4];
        try {
            int count = 0;
            byte[] x = Value.getBytes();

            while (count < x.length) {
                for (int n = 0; n <= 3; n++) {
                    if (count >= x.length) {
                        d[n] = 64;
                    } else {
                        int y = this.TableBase64.indexOf(x[count]);
                        if (y < 0)
                            y = 65;
                        d[n] = ((byte) y);
                    }
                    count++;
                }

                o.write((byte) (((d[0] & 0x3F) << 2) + ((d[1] & 0x30) >> 4)));
                if (d[2] != 64) {
                    o.write((byte) (((d[1] & 0xF) << 4) + ((d[2] & 0x3C) >> 2)));
                    if (d[3] != 64)
                        o.write((byte) (((d[2] & 0x3) << 6) + (d[3] & 0x3F)));
                }
            }
        } catch (StringIndexOutOfBoundsException e) {
            this.FError = (String.valueOf(this.FError) + String.valueOf(e.toString()));
            System.out.println(e.toString());
        }
        return o.toString();
    }

    public String EncodeBase64(String Value)
  {
    ByteArrayOutputStream o = new ByteArrayOutputStream();
    byte[] d = new byte[4];
    try
    {
      int count = 0;
      int n;
      for (byte[] x = Value.getBytes(); count < x.length;)
      {
        byte c = x[count];
        count++;
        d[0] = ((byte)((c & 0xFC) >> 2));
        d[1] = ((byte)((c & 0x3) << 4));
        if (count < x.length)
        {
          c = x[count];
          count++;
          d[1] = ((byte)(d[1] + (byte)((c & 0xF0) >> 4)));
          d[2] = ((byte)((c & 0xF) << 2));
          if (count < x.length)
          {
            c = x[count];
            count++;
            d[2] = ((byte)(d[2] + ((c & 0xC0) >> 6)));
            d[3] = ((byte)(c & 0x3F));
          }
          else {
            d[3] = 64;
          }
        }
        else {
          d[2] = 64;
          d[3] = 64;
        }
        n = 0;
        if (true) 
        continue;
        
        o.write(this.TableBase64.charAt(d[n]));
        n++;
      }

    }
    catch (StringIndexOutOfBoundsException e)
    {
      this.FError = (String.valueOf(this.FError) + String.valueOf(e.toString()));
      System.out.println(e.toString());
    }
    return o.toString();
  }

    protected String FormatHead(String vString) {
        if (vString.length() > 16)
            return vString.substring(0, 16);
        for (int i = vString.length() + 1; i < 17; i++) {
            vString = vString.concat(" ");
        }
        return vString;
    }

    public int GetFieldCount() {
        int i = 0;
        int j = 0;
        for (i = this.FMsgText.indexOf("\r\n", i + 1); i != -1; i = this.FMsgText.indexOf("\r\n", i + 1)) {
            j++;
        }
        return j;
    }

    public String GetFieldName(int Index) {
        int i = 0;
        int j = 0;
        int k = 0;
        int n = 0;
        String mFieldString = "";
        String mFieldName = "";
        String mReturn = "";

        while ((i != -1) && (j < Index)) {
            i = this.FMsgText.indexOf("\r\n", i + 1);
            if (i != -1)
                j++;
        }
        k = this.FMsgText.indexOf("\r\n", i + 1);
        if ((i != -1) && (k != -1)) {
            if (i == 0)
                mFieldString = this.FMsgText.substring(i, k);
            else
                mFieldString = this.FMsgText.substring(i + 2, k);
            n = mFieldString.indexOf("=", 0);
            if (n != -1) {
                mFieldName = mFieldString.substring(0, n);
                mReturn = mFieldName;
            }
        }
        return mReturn;
    }

    public String GetFieldText() {
        return this.FMsgText.toString();
    }

    public String GetFieldValue(int Index) {
        int i = 0;
        int j = 0;
        int k = 0;
        int n = 0;
        String mFieldString = "";
        String mFieldValue = "";
        String mReturn = "";

        while ((i != -1) && (j < Index)) {
            i = this.FMsgText.indexOf("\r\n", i + 1);
            if (i != -1)
                j++;
        }
        k = this.FMsgText.indexOf("\r\n", i + 1);
        if ((i != -1) && (k != -1)) {
            if (i == 0)
                mFieldString = this.FMsgText.substring(i, k);
            else
                mFieldString = this.FMsgText.substring(i + 2, k);
            n = mFieldString.indexOf("=", 0);
            if (n != -1) {
                mFieldValue = mFieldString.substring(n + 1, mFieldString.length());
                mReturn = DecodeBase64(mFieldValue);
            }
        }
        return mReturn;
    }

    public String GetMsgByName(String FieldName) {
        int i = 0;
        int j = 0;
        String mReturn = "";
        String mFieldName = FieldName.trim().concat("=");
        i = this.FMsgText.indexOf(mFieldName);
        if (i != -1) {
            j = this.FMsgText.indexOf("\r\n", i + 1);
            i += mFieldName.length();
            if (j != -1) {
                String mFieldValue = this.FMsgText.substring(i, j);
                mReturn = DecodeBase64(mFieldValue);
                return mReturn;
            }

            return mReturn;
        }

        return mReturn;
    }

    public boolean MakeDirectory(String FilePath) {
        File mFile = new File(FilePath);
        mFile.mkdirs();
        return mFile.isDirectory();
    }

    public void MsgError(String Value) {
        this.FError = Value;
    }

    public String MsgError() {
        return this.FError;
    }

    public void MsgErrorClear() {
        this.FError = "";
    }

    public void MsgFileBody(byte[] Value) {
        this.FMsgFile = Value;
        this.FFileSize = this.FMsgFile.length;
    }

    public byte[] MsgFileBody() {
        return this.FMsgFile;
    }

    public void MsgFileClear() {
        this.FFileSize = 0;
        this.FMsgFile = null;
    }

    public boolean MsgFileLoad(String FileName) {
        try {
            File mFile = new File(FileName);
            int mSize = (int) mFile.length();
            int mRead = 0;
            this.FMsgFile = new byte[mSize];
            FileInputStream mStream = new FileInputStream(mFile);
            while (mRead < mSize)
                mRead += mStream.read(this.FMsgFile, mRead, mSize - mRead);
            mStream.close();
            this.FFileSize = mSize;
            return true;
        } catch (Exception e) {
            this.FError = (String.valueOf(this.FError) + String.valueOf(e.toString()));
            System.out.println(e.toString());
            return false;
        }
    }

    public boolean MsgFileSave(String FileName) {
        try {
            FileOutputStream mFile = new FileOutputStream(FileName);
            mFile.write(this.FMsgFile);
            mFile.close();
            return true;
        } catch (Exception e) {
            this.FError = (String.valueOf(this.FError) + String.valueOf(e.toString()));
            System.out.println(e.toString());
            return false;
        }
    }

    public void MsgFileSize(int value) {
        this.FFileSize = value;
    }

    public int MsgFileSize() {
        return this.FFileSize;
    }

    public void MsgTextBody(String Value) {
        this.FMsgText = Value;
    }

    public String MsgTextBody() {
        return this.FMsgText;
    }

    public void MsgTextClear() {
        this.FMsgText = "";
    }

    private boolean MsgToStream() {
        int HeadSize = 64;
        int BodySize = 0;
        int ErrorSize = 0;
        int FileSize = 0;
        int Position = 0;
        try {
            Position = 0;
            BodySize = this.FMsgText.getBytes().length;
            ErrorSize = this.FError.getBytes().length;
            FileSize = this.FFileSize;
            ByteArrayOutputStream mBuffer = new ByteArrayOutputStream(HeadSize + BodySize + ErrorSize + FileSize);
            String HeadString = String.valueOf(String.valueOf(new StringBuffer(String.valueOf(String.valueOf(FormatHead(this.FVersion)))).append(FormatHead(String.valueOf(BodySize))).append(FormatHead(String.valueOf(ErrorSize))).append(FormatHead(String.valueOf(FileSize)))));
            mBuffer.write(HeadString.getBytes(), Position, HeadSize);
            Position += HeadSize;
            if (BodySize > 0)
                mBuffer.write(this.FMsgText.getBytes());
            Position += BodySize;
            if (ErrorSize > 0)
                mBuffer.write(this.FError.getBytes());
            Position += ErrorSize;
            if (FileSize > 0)
                mBuffer.write(this.FMsgFile);
            Position += FileSize;
            mBuffer.close();
            this.FStream = mBuffer.toByteArray();
            return true;
        } catch (IOException e) {
            this.FError = (String.valueOf(this.FError) + String.valueOf(e.toString()));
            System.out.println(e.toString());
            return false;
        }
    }

    public void MsgVariant(byte[] mStream) {
        this.FStream = mStream;
        if (this.FError == "")
            StreamToMsg();
    }

    public byte[] MsgVariant() {
        MsgToStream();
        return this.FStream;
    }

    public String MsgVersion() {
        return this.FVersion;
    }

    public boolean SavePackage(String FileName) {
        try {
            FileOutputStream mFile = new FileOutputStream(FileName);
            mFile.write(this.FStream);
            mFile.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();

            return false;
        }
    }

    public void SetMsgByName(String FieldName, String FieldValue) {
        String mFieldText = "";
        String mFieldHead = "";
        String mFieldNill = "";
        int i = 0;
        int j = 0;
        boolean f = false;
        String mFieldName = FieldName.trim().concat("=");
        String mFieldValue = EncodeBase64(FieldValue);
        mFieldText = String.valueOf(String.valueOf(new StringBuffer(String.valueOf(String.valueOf(mFieldName))).append(mFieldValue).append("\r\n")));
        i = this.FMsgText.indexOf(mFieldName);
        if (i != -1) {
            j = this.FMsgText.indexOf("\r\n", i + 1);
            if (j != -1) {
                mFieldHead = this.FMsgText.substring(0, i);
                mFieldNill = this.FMsgText.substring(j + 2);
                f = true;
            }
        }
        if (f)
            this.FMsgText = String.valueOf(new StringBuffer(String.valueOf(String.valueOf(mFieldHead))).append(mFieldText).append(mFieldNill));
        else
            this.FMsgText = this.FMsgText.concat(mFieldText);
    }

    private boolean StreamToMsg() {
        int HeadSize = 64;
        int BodySize = 0;
        int ErrorSize = 0;
        int FileSize = 0;
        int Position = 0;
        try {
            Position = 0;
            String HeadString = new String(this.FStream, Position, HeadSize);
            this.FVersion = HeadString.substring(0, 15);
            BodySize = Integer.parseInt(HeadString.substring(16, 31).trim());
            ErrorSize = Integer.parseInt(HeadString.substring(32, 47).trim());
            FileSize = Integer.parseInt(HeadString.substring(48, 63).trim());
            this.FFileSize = FileSize;
            Position += HeadSize;
            if (BodySize > 0)
                this.FMsgText = new String(this.FStream, Position, BodySize);
            Position += BodySize;
            if (ErrorSize > 0)
                this.FError = new String(this.FStream, Position, ErrorSize);
            Position += ErrorSize;
            this.FMsgFile = new byte[FileSize];
            if (FileSize > 0) {
                for (int i = 0; i < FileSize; i++) {
                    this.FMsgFile[i] = this.FStream[(i + Position)];
                }
            }
            return true;
        } catch (Exception e) {
            this.FError = (String.valueOf(this.FError) + String.valueOf(e.toString()));
            System.out.println(e.toString());
            return false;
        }
    }
}