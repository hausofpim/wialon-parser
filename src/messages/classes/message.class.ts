export abstract class Message {
  abstract messageType: string;
  abstract responseType: string;
  abstract messageParams?: string;

  abstract parseMessage(messageParams?: string);
  abstract generateMessageResponse();
}
