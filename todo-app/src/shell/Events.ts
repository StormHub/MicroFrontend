export type EventCallback = (payload: any) => void

export type MiddlewareCallback<T> = (e: IDomainEvent<T>, next: MiddlewareNext<T>) => void

export type MiddlewareNext<T> = (e: IDomainEvent<T>) => T

export interface IEventHandler {
    index: number,
    unsubscribe: () => void
}

export interface IEventData<T> {
    recorded: Date,
    payload: T,
    channel: string,
}

export interface IDomainEvent<T> extends IEventData<T> {
    toJSON(): IEventData<T>
}

export interface IEventSubscription {
    channel: string,
    callback: EventCallback,
}

export interface IEventBus {
    publish<T>(event: IDomainEvent<T>): void
    subscribe(subscription: IEventSubscription): IEventHandler
    unregister(channel: string): boolean
    unregisterAll(): boolean
}

export class DomainEvent<T = {}> implements IDomainEvent<T> {
    public readonly recorded: Date;
    public readonly channel: string;
    public readonly payload: T;
  
    constructor(channel: string, payload: T) {
      this.recorded = new Date()
      this.channel = channel;
      this.payload = payload;
    }
  
    toJSON(): IEventData<T> {
      return {
        payload: this.payload,
        channel: this.channel,
        recorded: this.recorded
      }
    }
}

export class EventBus implements IEventBus {
    private readonly middleware: MiddlewareCallback<any>[]
    private subscriptions: IEventSubscription[]
  
    constructor(middleware?: MiddlewareCallback<any>[]) {
      this.subscriptions = []
      this.middleware = middleware ? [...middleware] : []
    }
  
    unregisterAll(): boolean {
      this.subscriptions = []
      return true
    }
  
    unregister(channel: string): boolean {
      if (channel) {
        this.subscriptions = this.subscriptions.filter(s => s.channel !== channel)
        return true
      }
      return false
    }
  
    subscribe(subscription: IEventSubscription): IEventHandler {
      const that = this
      const index = this.subscriptions.push(subscription)
      return {
        index: index,
        unsubscribe: function() {
          that.subscriptions.splice(index - 1, 1)
        }
      }
    }
  
    publish<T>(event: IDomainEvent<T>): void {
      const publishToChannel: MiddlewareCallback<any> = (event: IDomainEvent<T>) => {
        this.subscriptions.forEach(x => {
          if (x.channel === event.channel) {
            x.callback(event);
          }
        })
      };

      const middleware: MiddlewareCallback<any>[] = [...this.middleware, publishToChannel];

      function run(event: IDomainEvent<T>) {
          const first: MiddlewareCallback<any> = middleware.splice(0, 1)[0]
          return first(event, run)
      }

      run(event);
    }
  }
