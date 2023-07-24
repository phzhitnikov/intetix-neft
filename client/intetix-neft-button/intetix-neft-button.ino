#include "Button.h"

#define DEVICE_ID 0
#define BUTTONS_COUNT 4

Button scene1Button(5);
Button scene2Button(4);
Button scene3Button(3);
Button homeButton(6);


Button *buttons[BUTTONS_COUNT]{
        &scene1Button,
        &scene2Button,
        &scene3Button,
        &homeButton,
};


String get_button_tag(const uint8_t id) {
    switch (id) {
        case 0: return F("Scene 1");
        case 1: return F("Scene 2");
        case 2: return F("Scene 3");
        case 3: return F("Exit");
        default: return F("");
    }
}


void setup() {
    Serial.begin(9600);
    // Do nothing while Serial is initializing
    while (!Serial);

    delay(100);

    // Init device
    Serial.print(F("Init button "));
    Serial.print(DEVICE_ID);
    Serial.println();

    // Init all the buttons
    for (auto &button: buttons) {
        button->init();
    }
}

void loop() {
    for (int i = 0; i < BUTTONS_COUNT; i++) {
        buttons[i]->update();

        if (buttons[i]->wasPressed()) {
            Serial.print(F("Button "));
            Serial.print(DEVICE_ID);
            Serial.print(F(": "));
            Serial.println(get_button_tag(i));
        }
    }
}