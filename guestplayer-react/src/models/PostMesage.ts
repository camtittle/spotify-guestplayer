export interface PostMessage<TMessage> {
  type: 'navigate';
  message: TMessage;
}