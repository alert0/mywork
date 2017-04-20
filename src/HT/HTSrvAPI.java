package HT;

import java.security.DigestException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;

public class HTSrvAPI
{
  public String HTSrvSHA1(String paramString, int paramInt)
  {
    String str = "";
    try
    {
      byte[] arrayOfByte = new byte[20];
      MessageDigest localMessageDigest = MessageDigest.getInstance("SHA-1");
      localMessageDigest.update(paramString.getBytes(), 0, paramInt);
      localMessageDigest.digest(arrayOfByte, 0, 20);
      str = ByteToString(arrayOfByte, 20);
    }
    catch (NoSuchAlgorithmException localNoSuchAlgorithmException)
    {
      localNoSuchAlgorithmException.printStackTrace();
    }
    catch (DigestException localDigestException)
    {
      localDigestException.printStackTrace();
    }

    return str;
  }

  public String HTSrvCrypt(int paramInt1, String paramString1, int paramInt2, String paramString2)
  {
    byte[] arrayOfByte1 = new byte[24];

    String str1 = paramString1 + paramString1.substring(0, 16);

    byte[] arrayOfByte2 = new byte[24];
    arrayOfByte2 = StrToByte(str1);

    byte[] arrayOfByte3 = StrToByte(paramString2);
    try
    {
      int i = 1;
      DESedeKeySpec localDESedeKeySpec = new DESedeKeySpec(arrayOfByte2);
      SecretKeyFactory localSecretKeyFactory = SecretKeyFactory.getInstance("DESede");
      SecretKey localSecretKey = localSecretKeyFactory.generateSecret(localDESedeKeySpec);
      Cipher localCipher = Cipher.getInstance("DESede");
      localCipher.init(i, localSecretKey);
      arrayOfByte1 = localCipher.doFinal(arrayOfByte3);
    }
    catch (Exception localException) {
      localException.printStackTrace();
    }

    String str2 = ByteToString(arrayOfByte1, 24);
    return str2;
  }

  public String ByteToString(byte[] paramArrayOfByte, int paramInt)
  {
    if (paramArrayOfByte == null) {
      return "";
    }
    StringBuffer localStringBuffer = new StringBuffer();

    byte[] arrayOfByte = paramArrayOfByte;

    for (int i = 0; i < paramInt; i++)
    {
      int j = arrayOfByte[i] >> 4 & 0xF;
      localStringBuffer.append("0123456789ABCDEF00000".charAt(j));
      j = arrayOfByte[i] & 0xF;
      localStringBuffer.append("0123456789ABCDEF00000".charAt(j));
    }

    return localStringBuffer.toString();
  }

  public byte[] StrToByte(String paramString)
  {
    int k = paramString.length();
    byte[] arrayOfByte = new byte[k / 2];
    char[] arrayOfChar = new char[k];

    for (int m = 0; m < k; m++) {
      arrayOfChar[m] = paramString.charAt(m);
    }
    for (int i = 0; i < k; i++) {
      int j = (byte)arrayOfChar[i];
      if (i % 2 == 0) {
        if ((j >= 48) && (j <= 57))
          arrayOfByte[(i / 2)] = ((byte)(j - 48 << 4));
        else if ((j >= 97) && (j <= 102))
          arrayOfByte[(i / 2)] = ((byte)(j - 87 << 4));
        else if ((j >= 65) && (j <= 70)) {
          arrayOfByte[(i / 2)] = ((byte)(j - 55 << 4));
        }

      }
      else if ((j >= 48) && (j <= 57))
      {
        int tmp168_167 = (i / 2);
        byte[] tmp168_163 = arrayOfByte; tmp168_163[tmp168_167] = ((byte)(tmp168_163[tmp168_167] | j - 48));
      } else if ((j >= 97) && (j <= 102))
      {
        int tmp197_196 = (i / 2);
        byte[] tmp197_192 = arrayOfByte; tmp197_192[tmp197_196] = ((byte)(tmp197_192[tmp197_196] | j - 87));
      } else if ((j >= 65) && (j <= 70))
      {
        int tmp226_225 = (i / 2);
        byte[] tmp226_221 = arrayOfByte; tmp226_221[tmp226_225] = ((byte)(tmp226_221[tmp226_225] | j - 55));
      }

    }

    return arrayOfByte;
  }

  public static String HexToStr(byte[] paramArrayOfByte, int paramInt)
  {
    char[] arrayOfChar = new char[2 * paramInt + 1];

    for (int i = 0; i < paramInt; i++) {
      if (((paramArrayOfByte[i] & 0xF0) >> 4 >= 0) && ((paramArrayOfByte[i] & 0xF0) >> 4 <= 9))
        arrayOfChar[(2 * i)] = ((char)(((paramArrayOfByte[i] & 0xF0) >> 4) + 48));
      else if (((paramArrayOfByte[i] & 0xF0) >> 4 >= 10) && ((paramArrayOfByte[i] & 0xF0) >> 4 <= 16)) {
        arrayOfChar[(2 * i)] = ((char)(((paramArrayOfByte[i] & 0xF0) >> 4) + 55));
      }

      if (((paramArrayOfByte[i] & 0xF) >= 0) && ((paramArrayOfByte[i] & 0xF) <= 9))
        arrayOfChar[(2 * i + 1)] = ((char)((paramArrayOfByte[i] & 0xF) + 48));
      else if (((paramArrayOfByte[i] & 0xF) >= 10) && ((paramArrayOfByte[i] & 0xF) <= 16)) {
        arrayOfChar[(2 * i + 1)] = ((char)((paramArrayOfByte[i] & 0xF) + 55));
      }
    }
    String str = new String(arrayOfChar);
    return str;
  }
}