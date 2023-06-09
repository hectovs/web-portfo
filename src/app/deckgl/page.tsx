"use client"

import { useState } from 'react';
import DeckGL from '@deck.gl/react';
import {HexagonLayer} from '@deck.gl/aggregation-layers'
import ReactMap from 'react-map-gl';

const STYLE = {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 19
      }
    ]
};


export default function DemoMap() { 
    const [view, setView] = useState({
        longitude: -1.80,
        latitude: 53.29,
        zoom: 10
    })

    return (
        <ReactMap
            mapStyle={STYLE}
            width="100vw"
            height="100vh"
            {...view}
            onViewportChange={(v)=>setView(v)}
        />
    )
}
