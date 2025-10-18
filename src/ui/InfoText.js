import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

let split = SplitText.create(".info-text", { type: "words, chars" });

export class InfoText {
    constructor() {
        this.element = document.querySelector('.info-text');
        this.isVisible = false;
        this.hasBeenDismissed = false;

        // Set initial state to hidden
        if (this.element) {
            gsap.set(split.words, {
                opacity: 0,
                y: 20,
                autoAlpha: 0
            });
        }
    }

    show() {
        if (this.hasBeenDismissed || !this.element) return;

        this.isVisible = true;
        gsap.to(split.words, {
            duration: .5,
            opacity: 1,
            y: 0,
            autoAlpha: 1,
            stagger: 0.05
        });
    }

    hide() {
        if (!this.element || !this.isVisible) return;

        this.hasBeenDismissed = true;
        this.isVisible = false;

        gsap.to(split.words, {
            duration: .5,
            opacity: 0,
            y: 20,       // animate from 100px below
            autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
            stagger: 0.05 // 0.05 seconds between each
        });
    }

    getElement() {
        return this.element;
    }
}
