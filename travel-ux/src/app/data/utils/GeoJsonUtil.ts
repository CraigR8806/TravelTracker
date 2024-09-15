import { Feature, FeatureCollection } from "geojson";






export function featureCollectionFromListOfFeatures(features:Feature[]):FeatureCollection {
    return {
        "type":"FeatureCollection",
        "features":features
    }
}