interface EnabledElementWithRenderingTools extends cornerstone.EnabledElement {
  renderingTools?: {
    colormapId?: string;
    colorLut?: string;
    renderCanvas?: HTMLCanvasElement;
    renderCanvasContext?: CanvasRenderingContext2D;
    renderCanvasData?: ImageData;
  };
}
