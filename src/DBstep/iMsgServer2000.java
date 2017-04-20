package DBstep;

import java.io.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class iMsgServer2000
{

    public static final String Md5Value = null;
    private String VERSION;
    private String TableBase64;
    private byte FStream[];
    private byte FMsgFile[];
    private String FMsgText;
    private String FError;
    private String FVersion;
    private int FFileSize;
    public String Charset;

    public iMsgServer2000()
    {
        VERSION = "DBSTEP V3.0";
        TableBase64 = "FxcYg3UZvtEz50Na8G476=mLDI/jVfC9dsoMAiBhJSu2qPKe+QRbXry1TnkWHlOpw";
        FMsgText = new String();
        FError = new String();
        FVersion = new String();
        FFileSize = 0;
        FMsgText = "";
        FError = "";
        FVersion = "DBSTEP V3.0";
    }

    protected String FormatHead(String vString)
    {
        if(vString.length() > 16)
            return vString.substring(0, 16);
        for(int i = vString.length() + 1; i < 17; i++)
            vString = vString.concat(" ");

        return vString;
    }

    private boolean MsgToStream()
    {
        int HeadSize = 64;
        int BodySize = 0;
        int ErrorSize = 0;
        int FileSize = 0;
        int Position = 0;
        try
        {
            Position = 0;
            BodySize = FMsgText.getBytes().length;
            ErrorSize = FError.getBytes().length;
            FileSize = FFileSize;
            ByteArrayOutputStream mBuffer = new ByteArrayOutputStream(HeadSize + BodySize + ErrorSize + FileSize);
            String HeadString = String.valueOf(String.valueOf((new StringBuffer(String.valueOf(String.valueOf(FormatHead(FVersion))))).append(FormatHead(String.valueOf(BodySize))).append(FormatHead(String.valueOf(ErrorSize))).append(FormatHead(String.valueOf(FileSize)))));
            mBuffer.write(HeadString.getBytes(), Position, HeadSize);
            Position += HeadSize;
            if(BodySize > 0)
                mBuffer.write(FMsgText.getBytes());
            Position += BodySize;
            if(ErrorSize > 0)
                mBuffer.write(FError.getBytes());
            Position += ErrorSize;
            if(FileSize > 0)
                mBuffer.write(FMsgFile);
            Position += FileSize;
            mBuffer.close();
            FStream = mBuffer.toByteArray();
            boolean flag = true;
            return flag;
        }
        catch(Exception e)
        {
            FError = String.valueOf(FError) + String.valueOf(e.toString());
            System.out.println(e.toString());
            boolean flag1 = false;
            return flag1;
        }
    }

    public byte[] MsgVariant()
    {
        MsgToStream();
        return FStream;
    }

    private boolean StreamToMsg()
    {
        int HeadSize = 64;
        int BodySize = 0;
        int ErrorSize = 0;
        int FileSize = 0;
        int Position = 0;
        try
        {
            Position = 0;
            String HeadString = new String(FStream, Position, HeadSize);
            FVersion = HeadString.substring(0, 15);
            BodySize = Integer.parseInt(HeadString.substring(16, 31).trim());
            ErrorSize = Integer.parseInt(HeadString.substring(32, 47).trim());
            FileSize = Integer.parseInt(HeadString.substring(48, 63).trim());
            FFileSize = FileSize;
            Position += HeadSize;
            if(BodySize > 0)
                FMsgText = new String(FStream, Position, BodySize);
            Position += BodySize;
            if(ErrorSize > 0)
                FError = new String(FStream, Position, ErrorSize);
            Position += ErrorSize;
            FMsgFile = new byte[FileSize];
            if(FileSize > 0)
            {
                for(int i = 0; i < FileSize; i++)
                    FMsgFile[i] = FStream[i + Position];

            }
            boolean flag = true;
            return flag;
        }
        catch(Exception e)
        {
            FError = String.valueOf(FError) + String.valueOf(e.toString());
            System.out.println(e.toString());
            boolean flag1 = false;
            return flag1;
        }
    }

    public void MsgVariant(byte mStream[])
    {
        FStream = mStream;
        if(FError == "")
            StreamToMsg();
    }

    public boolean SavePackage(String FileName)
    {
        try
        {
            FileOutputStream mFile = new FileOutputStream(FileName);
            mFile.write(FStream);
            mFile.close();
            boolean flag = true;
            return flag;
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        boolean flag1 = false;
        return flag1;
    }

    public boolean MsgFileSave(String FileName)
    {
        try
        {
            FileOutputStream mFile = new FileOutputStream(FileName);
            mFile.write(FMsgFile);
            mFile.close();
            boolean flag = true;
            return flag;
        }
        catch(Exception e)
        {
            FError = String.valueOf(FError) + String.valueOf(e.toString());
            System.out.println(e.toString());
            boolean flag1 = false;
            return flag1;
        }
    }

    public boolean MsgFileLoad(String FileName)
    {
        try
        {
            File mFile = new File(FileName);
            int mSize = (int)mFile.length();
            int mRead = 0;
            FMsgFile = new byte[mSize];
            FileInputStream mStream = new FileInputStream(mFile);
            for(; mRead < mSize; mRead += mStream.read(FMsgFile, mRead, mSize - mRead));
            mStream.close();
            FFileSize = mSize;
            boolean flag1 = true;
            return flag1;
        }
        catch(Exception e)
        {
            FError = String.valueOf(FError) + String.valueOf(e.toString());
            System.out.println(e.toString());
            boolean flag = false;
            return flag;
        }
    }

    public String MsgTextBody()
    {
        return FMsgText;
    }

    public byte[] MsgFileBody()
    {
        return FMsgFile;
    }

    public String MsgError()
    {
        return FError;
    }

    public String MsgVersion()
    {
        return FVersion;
    }

    public void MsgTextBody(String Value)
    {
        FMsgText = Value;
    }

    public void MsgFileBody(byte Value[])
    {
        FMsgFile = Value;
        FFileSize = FMsgFile.length;
    }

    public void MsgError(String Value)
    {
        FError = Value;
    }

    public int MsgFileSize()
    {
        return FFileSize;
    }

    public void MsgFileSize(int value)
    {
        FFileSize = value;
    }

    public void MsgFileClear()
    {
        FFileSize = 0;
        FMsgFile = null;
    }

    public void MsgTextClear()
    {
        FMsgText = "";
    }

    public void MsgErrorClear()
    {
        FError = "";
    }

    public String DecodeBase64(String Value)
    {
        ByteArrayOutputStream o = new ByteArrayOutputStream();
        byte d[] = new byte[4];
        try
        {
            int count = 0;
            byte x[] = Value.getBytes();
            do
            {
                if(count >= x.length)
                    break;
                for(int n = 0; n <= 3; n++)
                {
                    if(count >= x.length)
                    {
                        d[n] = 64;
                    } else
                    {
                        int y = TableBase64.indexOf(x[count]);
                        if(y < 0)
                            y = 65;
                        d[n] = (byte)y;
                    }
                    count++;
                }

                o.write((byte)(((d[0] & 0x3f) << 2) + ((d[1] & 0x30) >> 4)));
                if(d[2] != 64)
                {
                    o.write((byte)(((d[1] & 0xf) << 4) + ((d[2] & 0x3c) >> 2)));
                    if(d[3] != 64)
                        o.write((byte)(((d[2] & 0x3) << 6) + (d[3] & 0x3f)));
                }
            } while(true);
        }
        catch(StringIndexOutOfBoundsException e)
        {
            FError = String.valueOf(FError) + String.valueOf(e.toString());
            System.out.println(e.toString());
        }
        return o.toString(); 
    }

    public String EncodeBase64(String Value)
    {
        
        ByteArrayOutputStream o = new ByteArrayOutputStream();
        byte d[] = new byte[4];
        try
        {
            int count = 0;
            for(byte x[] = Value.getBytes(); count < x.length;)
            {
                byte c = x[count];
                count++;
                d[0] = (byte)((c & 0xfc) >> 2);
                d[1] = (byte)((c & 0x3) << 4);
                if(count < x.length)
                {
                    c = x[count];
                    count++;
                    d[1] = (byte)(d[1] + (byte)((c & 0xf0) >> 4));
                    d[2] = (byte)((c & 0xf) << 2);
                    if(count < x.length)
                    {
                        c = x[count];
                        count++;
                        d[2] = (byte)(d[2] + ((c & 0xc0) >> 6));
                        d[3] = (byte)(c & 0x3f);
                    } else
                    {
                        d[3] = 64;
                    }
                } else
                {
                    d[2] = 64;
                    d[3] = 64;
                }
                int n = 0;
                while(n <= 3) 
                {
                    o.write(TableBase64.charAt(d[n]));
                    n++;
                }
            }

        }
        catch(StringIndexOutOfBoundsException e)
        {
            FError = String.valueOf(FError) + String.valueOf(e.toString());
            System.out.println(e.toString());
        }
        return o.toString();  
    }

    public int GetFieldCount()
    {
        int i = 0;
        int j = 0;
        for(i = FMsgText.indexOf("\r\n", i + 1); i != -1; i = FMsgText.indexOf("\r\n", i + 1))
            j++;

        return j;
    }

    public String GetFieldName(int Index)
    {
        int i = 0;
        int j = 0;
        int k = 0;
        int n = 0;
        String mFieldString = "";
        String mFieldName = "";
        String mReturn = "";
        do
        {
            if(i == -1 || j >= Index)
                break;
            i = FMsgText.indexOf("\r\n", i + 1);
            if(i != -1)
                j++;
        } while(true);
        k = FMsgText.indexOf("\r\n", i + 1);
        if(i != -1 && k != -1)
        {
            if(i == 0)
                mFieldString = FMsgText.substring(i, k);
            else
                mFieldString = FMsgText.substring(i + 2, k);
            n = mFieldString.indexOf("=", 0);
            if(n != -1)
            {
                mFieldName = mFieldString.substring(0, n);
                mReturn = mFieldName;
            }
        }
        return mReturn;
    }

    public String GetFieldValue(int Index)
    {
        int i = 0;
        int j = 0;
        int k = 0;
        int n = 0;
        String mFieldString = "";
        String mFieldValue = "";
        String mReturn = "";
        do
        {
            if(i == -1 || j >= Index)
                break;
            i = FMsgText.indexOf("\r\n", i + 1);
            if(i != -1)
                j++;
        } while(true);
        k = FMsgText.indexOf("\r\n", i + 1);
        if(i != -1 && k != -1)
        {
            if(i == 0)
                mFieldString = FMsgText.substring(i, k);
            else
                mFieldString = FMsgText.substring(i + 2, k);
            n = mFieldString.indexOf("=", 0);
            if(n != -1)
            {
                mFieldValue = mFieldString.substring(n + 1, mFieldString.length());
                mReturn = DecodeBase64(mFieldValue);
            }
        }
        return mReturn;
    }

    public String GetFieldText()
    {
        return FMsgText.toString();
    }

    public String GetMsgByName(String FieldName)
    {
        int i = 0;
        int j = 0;
        String mReturn = "";
        String mReturn1 = "";
        String mFieldName = FieldName.trim().concat("=");
        i = FMsgText.indexOf(mFieldName);
        if(i != -1)
        {
            j = FMsgText.indexOf("\r\n", i + 1);
            i += mFieldName.length();
            if(j != -1)
            {
                String mFieldValue = FMsgText.substring(i, j);
                mReturn = DecodeBase64(mFieldValue);
                return mReturn;
            } else
            {
                return mReturn;
            }
        } else
        {
            return mReturn;
        }
    }

    public void SetMsgByName(String FieldName, String FieldValue)
    {
        String mFieldText = "";
        String mFieldHead = "";
        String mFieldNill = "";
        int i = 0;
        int j = 0;
        boolean f = false;
        String mFieldName = FieldName.trim().concat("=");
        String mFieldValue = EncodeBase64(FieldValue);
        mFieldText = String.valueOf(String.valueOf((new StringBuffer(String.valueOf(String.valueOf(mFieldName)))).append(mFieldValue).append("\r\n")));
        i = FMsgText.indexOf(mFieldName);
        if(i != -1)
        {
            j = FMsgText.indexOf("\r\n", i + 1);
            if(j != -1)
            {
                mFieldHead = FMsgText.substring(0, i);
                mFieldNill = FMsgText.substring(j + 2);
                f = true;
            }
        }
        if(f)
            FMsgText = (new StringBuffer(String.valueOf(String.valueOf((new StringBuffer(String.valueOf(String.valueOf(mFieldHead)))).append(mFieldText).append(mFieldNill))))).toString();
        else
            FMsgText = FMsgText.concat(mFieldText);
    }

    public boolean MakeDirectory(String FilePath)
    {
        File mFile = new File(FilePath);
        mFile.mkdirs();
        return mFile.isDirectory();
    }

    public byte[] ToDocument(byte[] msgFileBody) {
        // TODO Auto-generated method stub
        return null;
    }

    public void Load(HttpServletRequest request) {
        // TODO Auto-generated method stub
        
    }

    public void Send(HttpServletResponse response) {
        // TODO Auto-generated method stub
        
    }

    public String MD5Stream(byte[] fileBody) {
        // TODO Auto-generated method stub
        return null;
    }
}