#pragma once

#include <Arduino.h>
#include <Bounce2.h>

class Button {
public:
public:
    Button(const uint8_t input_pin,
           const bool activeLevel = LOW)
            : pin(input_pin),
              activeLevel(activeLevel) {
        if (pin != -1) {
            debouncer.attach(pin, INPUT_PULLUP);
            debouncer.interval(50);
        }
    }

    void init() {}

    void update() {
        debouncer.update();
    }

    inline bool wasPressed() const {
        return activeLevel == LOW ? debouncer.fell() : debouncer.rose();
    }

private:
    const uint8_t pin;
    const bool activeLevel;
    Bounce debouncer = Bounce();
};