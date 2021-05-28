import { PhotoR } from "./PhotoR";
import { PhotoResult } from "./photoResult";
//design pattern iterator
export class Photos implements IterableIterator<PhotoR> {

  protected current = 0;
  

  constructor(protected photos: PhotoR[]) {}

  public next(): IteratorResult<PhotoR> {
    
    
    if (this.current >= this.photos.length) {
      return {
        done: true,
        value: null
      } 
    } 
    return {
      done: false,
      value: this.photos[this.current++]
    }
  }

  [Symbol.iterator](): IterableIterator<PhotoR> {
    return this;
  }

}
