#ifndef _INIT_H
#define _INIT_H

void setup1() {
  // Serial.begin(38400);
  // while (!Serial) {
  // }
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
}

#endif