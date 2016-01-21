
let MESSAGE = "message";

export class MessageService {
    msgServiceInternal: MessageServiceInternal;

    constructor() {
        this.msgServiceInternal = new MessageServiceInternal();
    }

    setMessage(msg: string) {
        this.msgServiceInternal.setMessage(msg);
    }
}

export class MessageServiceInternal {
    message: string = "";

    constructor() {
        // FOR TESTING
        //setTimeout(() => this.setMessage("ASD"), 1000);
    }

    hasMessage() {
        let does = !!sessionStorage.getItem(MESSAGE);
        console.log(does);
        return does;
    }

    setMessage(msg: string) {
        sessionStorage.setItem(MESSAGE, msg);
    }

    deleteMessage() {
        this.setMessage("");
    }

    getMessage() {
        return sessionStorage.getItem(MESSAGE);
    }
}