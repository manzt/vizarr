import { CompositeLayer } from '@deck.gl/core';
import type { CompositeLayerProps } from '@deck.gl/core/lib/composite-layer';
import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import type { ZarrLoader } from '@hms-dbmi/viv';

type MultiscaleRGBLayerProps<D> = CompositeLayerProps<D> & {
  loader: ZarrLoader;
};

// ts-ignore
export default class MultiScaleRGBLayer<
  D,
  P extends MultiscaleRGBLayerProps<D> = MultiscaleRGBLayerProps<D>
> extends CompositeLayer<D, P> {
  renderLayers() {
    const { loader } = this.props;
    const { height, width } = loader.getRasterSize({ z: 0 } as any);
    const tileSize = loader.base.chunks[0];
    const { numLevels } = loader;
    const getTileData = async (tileCoords: { x: number; y: number; z: number }): Promise<ImageData | null> => {
      const { x, y, z } = tileCoords;
      const source = loader._data[-z];
      if (!source) return null;
      const { data, shape } = await source.getRawChunk([y, x, 0]);
      return new ImageData(new Uint8ClampedArray(data.buffer), shape[0], shape[1]);
    };
    return new TileLayer({
      tileSize,
      minZoom: -(numLevels - 1),
      maxZoom: 0,
      extent: [0, 0, width, height],
      // @ts-ignore
      getTileData,
      onTileError: loader.onTileError,
      renderSubLayers: (props) => {
        const { bbox } = props.tile;
        const { left, bottom, right, top } = bbox;
        return new BitmapLayer({
          ...props,
          data: null,
          image: props.data,
          bounds: [left, bottom, right, top],
        });
      },
    });
  }
}

MultiScaleRGBLayer.layerName = 'RGBAMultiscaleLayer';
