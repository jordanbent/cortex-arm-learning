"use strict";
// Author to Blame: haneefdm on github
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A simple implementation of a bitset of fixed size. You can make it dynamic by
 * extending this class and overriding the setters (setBit, clrBit and invBit) to
 * auto-resize. A resize function is provided.
 *
 * You can use it store flags in a very compact form and if your data is sparse, then you
 * can iterate over them faster. Gigantic space, yet super-sparse, consider a balanced tree
 * or a set/map/something-else
 *
 * Get/Set is O(1)
 * Traversal is O(N) => N = length of the array, but able to skip large empty spaces
 *
 * It is also a very efficient way of doing unions/intersections using bitwise operations.
 */
class FixedBitSet {
    constructor(len) {
        if (FixedBitSet.doAsserts) {
            console.assert(Number.isInteger(len) && (len >= 0));
        }
        this.xnumBits = len;
        this.bitArray = new Uint32Array(FixedBitSet.calcAryLen(len));
    }
    get numBits() {
        return this.xnumBits;
    }
    dup() {
        const ret = new FixedBitSet(this.numBits);
        ret.bitArray.set(this.bitArray);
        return ret;
    }
    ixRangeCheck(ix) {
        return Number.isInteger(ix) && (ix >= 0) && (ix < this.numBits);
    }
    /**
     * Get bit at specified index
     * @return a number that is either zero or non-zero
     */
    getBit(ix) {
        if (FixedBitSet.doAsserts) {
            console.assert(this.ixRangeCheck(ix), 'getBit: invalid index ', ix, this);
        }
        return this.bitArray[ix >>> 5 /* SHFT */] & (1 << (ix & 31 /* MASK */));
    }
    /** Sets the bit at index 'ix' to 1 */
    setBit(ix) {
        if (FixedBitSet.doAsserts) {
            console.assert(this.ixRangeCheck(ix), 'setBit: invalid index ', ix, this);
        }
        this.bitArray[ix >>> 5 /* SHFT */] |= (1 << (ix & 31 /* MASK */));
    }
    /** Sets the bit at index 'ix' to 0 */
    clrBit(ix) {
        if (FixedBitSet.doAsserts) {
            console.assert(this.ixRangeCheck(ix), 'clrBit: invalid index ', ix, this);
        }
        this.bitArray[ix >>> 5 /* SHFT */] &= ~(1 << (ix & 31 /* MASK */));
    }
    /** Inverts the bit at index 'ix' to 0 */
    invBit(ix) {
        if (FixedBitSet.doAsserts) {
            console.assert(this.ixRangeCheck(ix), 'invBit: invalid index ', ix, this);
        }
        this.bitArray[ix >>> 5 /* SHFT */] ^= (1 << (ix & 31 /* MASK */));
    }
    /** clears all bits */
    clearAll() {
        this.bitArray.fill(0);
    }
    /** Sets a set of four consecutive bits
     * @param ix: Must a multiple of four and in range
     */
    setNibble(ix) {
        if (FixedBitSet.doAsserts) {
            console.assert(this.ixRangeCheck(ix + 3), 'setNibble: invalid index ', ix, this);
            console.assert((ix & 0x3) === 0, 'setNibble: ix must be >= 0 & multiple of 4');
        }
        this.bitArray[ix >>> 5 /* SHFT */] |= ((0xf << (ix & 31 /* MASK */)) >>> 0);
    }
    toString() {
        return this.bitArray.toString();
    }
    /**
     * Iterator built for efficiency. No guarantees if you modify this object
     * while iterating (especially a resize)
     *
     * @param cb: a function called with the next bit position that is non-zero. If
     * callback returns false, iterator will terminate
     */
    findBitItor(cb) {
        // Could have used an actual Iterator interface but we have to keep too much
        // state to make a next() work properly.   
        let bitIx = 0;
        let aryIx = 0;
        while (bitIx < this.xnumBits) {
            let elem = this.bitArray[aryIx++];
            if (elem === 0) {
                bitIx += 32 /* NBITS */;
                continue;
            }
            for (let byteIx = 0; (byteIx < (32 /* NBITS */ / 8)) && (bitIx < this.numBits); byteIx++) {
                const byteVal = elem & 0xff;
                elem >>>= 8;
                if (byteVal === 0) { // Try to skip byte at a time
                    bitIx += 8;
                    continue;
                }
                // We do not bail early or skip bits to keep bitIx updated
                for (let bitPos = 1; (bitPos < (1 << 8)) && (bitIx < this.numBits); bitPos <<= 1) {
                    if (byteVal & bitPos) {
                        if (!cb(bitIx)) {
                            return;
                        }
                    }
                    bitIx++;
                }
            }
        }
    }
    /** Return an array of indices where a bit positions are non-zero */
    findAllBits() {
        const ret = [];
        this.findBitItor((ix) => {
            ret.push(ix);
            return true;
        });
        return ret;
    }
    /**
     * Iterator built for efficiency. No guarantees if you modify this object
     * while iterating (especially a resize). It scans four bits at a time.
     * We don't check if the entire nibble is set - any bit in the nibble being set
     *
     * @param cb: a function called with the next nibble position that is non-zero. If
     * callback returns false, iterator will terminate
     */
    findNibbleItor(cb) {
        let addr = 0;
        const stop = this.bitArray.length;
        for (let ix = 0; ix < stop; ix++) {
            let val = this.bitArray[ix];
            if (val !== 0) {
                for (let bits = 0; bits < 32 /* NBITS */; bits += 4) {
                    if ((0xf & val) !== 0) { // got something
                        if (addr < this.numBits) {
                            if (!cb(addr)) {
                                return;
                            }
                        }
                        else {
                            console.assert(false, 'Defect in FixedBitset. Not expecting a value in trailing bits');
                        }
                    }
                    addr += 4;
                    val >>>= 4;
                }
            }
            else {
                addr += 32 /* NBITS */;
            }
        }
    }
    /**
     * Not sure what this looks like on a big endian machine. We can correct for that
     * if needed. Expecting this to be used mostly for debugging. Note that the nibbles
     * are also backards in each byte. One char represents a nibble.
     */
    toHexString() {
        const buf = Buffer.from(this.bitArray.buffer);
        const str = buf.toString('hex');
        return str;
    }
    /** resizes the number of bits --  not yet tested */
    reSize(len) {
        if (FixedBitSet.doAsserts) {
            console.assert(Number.isInteger(len) && (len >= 0));
        }
        if (len <= 0) {
            this.xnumBits = 0;
            this.bitArray = new Uint32Array(0);
        }
        else if (len !== this.xnumBits) {
            const numUnits = FixedBitSet.calcAryLen(len);
            let newAry;
            if (numUnits <= this.bitArray.length) {
                newAry = this.bitArray.subarray(0, numUnits);
                const diff = (numUnits * 32 /* NBITS */) - len;
                if (diff > 0) { // clear any traiiing bits in most sig. portion
                    // We HAVE to clear trailing bits in case the nibble iterator is being used
                    const mask = (0xffffffff << (32 /* NBITS */ - diff)) >>> 0;
                    newAry[numUnits - 1] &= mask;
                }
            }
            else {
                newAry = new Uint32Array(numUnits);
                newAry.set(this.bitArray);
            }
            this.xnumBits = len;
            this.bitArray = newAry;
        }
    }
    /** Basically does a Math.ceil(len / NBITS) using integer ops. */
    static calcAryLen(len) {
        const ret = (len <= 0) ? 0 : ((len + 31 /* MASK */) >>> 5 /* SHFT */);
        return ret;
    }
}
// Enable this to do error checking. Maybe there is a better waay, to remove assert overhead
FixedBitSet.doAsserts = false;
exports.FixedBitSet = FixedBitSet;
//# sourceMappingURL=fixedbitset.js.map