interface MediatorEvent {
  mediator: string;
}
export function dispatchMediatorEvent({ mediator }: MediatorEvent) {
  window.dispatchEvent(
    new CustomEvent<MediatorEvent>("change-mediator", {
      detail: {
        mediator,
      },
    })
  );
}
