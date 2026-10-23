(() => {
  function split(rgba, width, height) {
    const count = width * height,
      labels = new Uint32Array(count),
      queue = new Uint32Array(count),
      components = [];
    let id = 0;
    for (let start = 0; start < count; start++) {
      if (labels[start] || !rgba[start * 4 + 3]) continue;
      id++;
      let head = 0,
        tail = 1;
      queue[0] = start;
      labels[start] = id;
      const component = { id, count: 0, x0: width, y0: height, x1: 0, y1: 0 };
      while (head < tail) {
        const index = queue[head++],
          x = index % width,
          y = Math.floor(index / width);
        component.count++;
        component.x0 = Math.min(component.x0, x);
        component.x1 = Math.max(component.x1, x);
        component.y0 = Math.min(component.y0, y);
        component.y1 = Math.max(component.y1, y);
        for (const next of [
          x ? index - 1 : -1,
          x < width - 1 ? index + 1 : -1,
          y ? index - width : -1,
          y < height - 1 ? index + width : -1,
        ])
          if (next >= 0 && !labels[next] && rgba[next * 4 + 3]) {
            labels[next] = id;
            queue[tail++] = next;
          }
      }
      components.push(component);
    }
    components.sort((a, b) => b.count - a.count);
    const bodyComponent = components[0],
      droneComponent = components.find(
        (c) =>
          c !== bodyComponent &&
          c.count > count * 0.005 &&
          c.x1 < width * 0.55 &&
          c.y0 < height * 0.25 &&
          c.y1 < height * 0.3,
      );
    if (!droneComponent) throw Error("No isolated drone outline");
    const body = new Uint8ClampedArray(rgba),
      drone = new Uint8ClampedArray(rgba.length);
    let dronePixels = 0;
    for (let i = 0; i < count; i++)
      if (labels[i] === droneComponent.id) {
        const offset = i * 4;
        drone.set(rgba.subarray(offset, offset + 4), offset);
        body[offset + 3] = 0;
        dronePixels++;
      }
    return { body, drone, dronePixels, bounds: droneComponent };
  }
  window.FlyByPortraitAlpha = { split };
})();
