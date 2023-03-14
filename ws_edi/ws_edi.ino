#if !defined(ESP32)
#error This code is intended to run only on the ESP32 boards ! Please check your Tools->Board setting.
#endif

#define _WEBSOCKETS_LOGLEVEL_ 2
#define LED 2

#include <WiFi.h>
#include <WiFiClientSecure.h>

#include <WebSocketsServer_Generic.h>
#include "fingerprint.h"
#include "init.h"

#define WS_PORT 80                                       // Port at which cleints can connect to server
WebSocketsServer webSocket = WebSocketsServer(WS_PORT);  //Server IP

String channel_name;          // This will store payload which is acting like channel name
int i;                        // No use as of now
int id[5];                    //This array stores client id assigned by us
uint8_t com, loc, mpu, smpu, er;  //These variables is used to store by default client id
String Com, Loc, Mpu, Smpu, Er;   // These variables are used to payload which is json string to be sent
String user_data;
uint8_t id_user;
// int flag = 0;


void hexdump(const void* mem, const uint32_t& len, const uint8_t& cols = 16) {
  const uint8_t* src = (const uint8_t*)mem;

  Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);

  for (uint32_t i = 0; i < len; i++) {
    if (i % cols == 0) {
      Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
    }

    Serial.printf("%02X ", *src);
    src++;
  }
  Serial.printf("\n");
}

String messageFromServer;  // This string stores data coming from cleint esp32 to server esp32

void webSocketEvent(const uint8_t& num, const WStype_t& type, uint8_t* payload, const size_t& length) {
  switch (type) {
    case WStype_DISCONNECTED:  // Executed when cleint is disconnected to server
      {
        Serial.printf("[%u] Disconnected!\n", num);
        digitalWrite(LED, LOW);
        break;
      }

    case WStype_CONNECTED:  // Executed when cleint is connected to server
      {
        IPAddress ip = webSocket.remoteIP(num);
        digitalWrite(LED, HIGH);
        channel_name = (char*)payload;
        if (channel_name == "/COM") {

          // id[0] = 1;
          id[num] = 1;
          com = num;
        }
        if (channel_name == "/MPU") {
          // id[1] = 2;
          id[num] = 2;
          // mpu = id[num];
          mpu = num;
        }
        if (channel_name == "/LOC") {
          // id[2] = 3;
          id[num] = 3;
          loc = num;
        }
        if (channel_name == "/SMPU") {
          // id[3] = 4;
          id[num] = 4;
          smpu = num;
        }
        if (channel_name == "/ER") {
          // id[4] = 5;
          id[num] = 5;
          er = num;
        }
        // webSocket.sendTXT(num, "Connected");


        break;
      }

    case WStype_TEXT:
      {
        if (id[num]==1) {
          Com = (char*)payload;
          Serial.print("COM:- ");
          Serial.println(Com);
          Com = Com + '*';
          Serial1.print(Com);
        }
        if (id[num]==2) {
          Mpu = (char*)payload;
          Serial.print("MPU:- ");
          Serial.println(Mpu);
          Mpu = Mpu + '*';
          // Serial2.print(Mpu);
        }
        if (id[num]==3) {
          Loc = (char*)payload;
          Serial.print("LOC:- ");
          Serial.println(Loc);
          Loc = Loc + '*';
          Serial2.print(Loc);
        }
        // if (id[num]==4) {
        //   Smpu = (char*)payload;
        //   Serial.print("SMPU:- ");
        //   Serial.println(Smpu);
        //   Smpu = Smpu + '*';
        //   // Serial2.print(Smpu);
        // }
        if (id[num]==5) {
          Er = (char*)payload;
          Serial.print("ER:- ");
          Serial.println(Er);
          webSocket.sendTXT(id[mpu], Er);
          
        }

        break;
      }

    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:

      break;

    default:
      break;
  }
}

void setup() {
  pinMode(LED, OUTPUT);
  // setup1();
  Serial.begin(115200);
  Serial2.begin(115200);
  Serial1.begin(115200,SERIAL_8N1,19,18);
    // Serial1.begin(115200,SERIAL_8N1,18,19);
    //----------------------------------------------------------------
      // delay(100);
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor !");
  } else {
    Serial.println("Did not find fingerprint sensor !");
    exit;
  }
  finger.getTemplateCount();

  if (finger.templateCount == 0) {
    Serial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
  } else {
    Serial.println("Waiting for valid finger...");
    Serial.print("Sensor contains ");
    Serial.print(finger.templateCount);
    Serial.println(" templates");
  }
  //--------------------------------------------------------------------------

  // WiFi.mode(WIFI_MODE_APSTA);
  // WiFi.softAP("ER-SERVER","ER");
  // Serial.print("Static IP is: ");
  // Serial.println(WiFi.softAPIP());

  // WiFi.begin("SVJ", "shardul.realme");  //This is connect to the Local Area Network
  // WiFi.begin("glitch", "12345678");
  // WiFi.begin("Raj", "123456789");
  // WiFi.begin("narzo 50A","realmenarzo");
  // WiFi.begin("ER", "akhilesh955");
  // WiFi.begin("IPH","yash1111");
  // WiFi.begin("Samsung", "12345678");
  WiFi.begin("ER","ER-Server");
  // WiFi.begin("F23","12345678");
  // WiFi.begin("Sakshi giri","19191919");MM
  // WiFi.begin("OnePlus 9R","Bagale@1810");
  // WiFi.begin("R1-Server", "R1-Server");
  // WiFi.begin("RR_hotspot","987654321");

  //WiFi.disconnect();
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println();

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  // server address, port and URL
  Serial.print("WebSockets Server started @ IP address: ");
  Serial.print(WiFi.localIP());
  Serial.print(", port: ");
  Serial.println(WS_PORT);
}

void loop() {
  webSocket.loop();
  // webSocket.sendTXT(id[mpu], "EDI");
  // getId();
  id_user = getId();
  if(flag == 1)
  {
    id_user = 0;
  }
  else {
   // id_user = id_user - 1;
  Serial.println(id_user);
  user_data = names[id_user];
  // webSocket.sendTXT(0, names[finger.fingerID]);
  // webSocket.sendTXT(0, user_data);
  webSocket.sendTXT(0, String(finger.fingerID));
  delay(2000);
  // delay(1000);
  // flag = 1;
  }
  // // id_user = id_user - 1;
  // Serial.println(id_user);
  // user_data = names[id_user];
  // // webSocket.sendTXT(0, names[finger.fingerID]);
  // webSocket.sendTXT(0, user_data);
  // // delay(1000);
  // // flag = 1;
  delay(15);
}
