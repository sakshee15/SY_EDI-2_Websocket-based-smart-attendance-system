#ifndef _FINGERPRINT_H
#define _FINGERPRINT_H


#include <Adafruit_Fingerprint.h>
#define LED 2
#define SCREEN_HEIGHT 64  // OLED display height, in pixels



#define lock 33
#define emergency 4

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial2);

uint8_t p;
uint8_t flag = 0;


String names[] = { "","Raj", "Shardul", "Sai", "Soham", "Tanmay", "Shraddha", "Ketan", "Shraddha_P", "Aditya", "Anvay", "Shreya", "Seema", "Poorva", "Nikita", "Neel", "Prasad", "Pranav", "Akhilesh", "Aditya_S", "Sarthak", "Salil", "Unmesh", "Himanshu", "Purva", "Sakshi", "Viraj", "Rucha", "Raj_rajsssalunkhe@gmail.com_12111362_8080592440", "Sakshee_sakshee.agrawal21@vit.edu_12111106_123456789","Sakshi_sakshijagdale@gmail.com_12111111_987654321" };


// void setup() {
//   // put your setup code here, to run once:
//   Serial.begin(38400);
//   while (!Serial) {
//   }
//   delay(100);
//   finger.begin(57600);

//   if (finger.verifyPassword()) {
//     Serial.println("Found fingerprint sensor !");
//   } else {
//     Serial.println("Did not find fingerprint sensor !");
//     exit;
//   }
//   finger.getTemplateCount();

//   if (finger.templateCount == 0) {
//     Serial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
//   } else {
//     Serial.println("Waiting for valid finger...");
//     Serial.print("Sensor contains ");
//     Serial.print(finger.templateCount);
//     Serial.println(" templates");
//   }
// }


uint8_t getId() {
  p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected"); 
      flag = 1;
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
    flag = 0;
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);

  // delay(500);


//display.println(names[finger.fingerID])


  return finger.fingerID;
}

// void loop() {
//   // put your main code here, to run repeatedly:
//   getId();
//   delay(50);
// }

#endif
