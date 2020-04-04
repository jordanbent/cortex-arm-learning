import { TreeItem, TreeItemCollapsibleState } from 'vscode';

import { BaseNode } from './basenode';
import { FieldNode } from './fieldnode';
import { NodeSetting } from '../../../common';

import { hexFormat, binaryFormat, createMask, extractBits } from '../../utils';
var hexToBinary = require('hex-to-binary');

export interface RegisterValue {
    number: number;
    value: string;
}

export class RegisterNode extends BaseNode {
    private fields: FieldNode[];
    private currentValue: number;
    private currentDecValue: string;
    private currentAsciiValue: string;
    private currentBinaryValue: string;
    private currentNaturalValue: string;
    

    public hex2bin(hexValue: string) 
    {
         var hexNumber = this.hexString2hexNumber(hexValue);
         var binary = hexNumber.toString(2);
         let leadingZeros = binary.length % 4;
         let add = '';
         if(leadingZeros > 0)
         {
            for(;leadingZeros > 0; leadingZeros--)
            {
               add += '0'
            }
         }
         binary = add+binary;
         let num = '';
         for(let i = 0; i < binary.length; i++)
         {
             if(i % 4 === 0)
                num +=(' '+binary[i])
             else
             num += (binary[i])
         }
      return num
    }

    public hex2Dec(hexValue: string) 
    {
        var signed = this.hexString2hexNumber(hexValue).toString(10);
        var unsigned = this.hexString2hexNumber(hexValue).toString(10);

        var hexNumber = this.hexString2hexNumber(hexValue);
        var binary = hexNumber.toString(2);

        var test:string = this.hexString2hexNumber(hexValue).toString(16)
        let mostSig = '';
        for(let i = 0; i < test.length; i++)
        {
            console.log('string',test[i])
            if(test[i] !== '0' || test[i] !== 'X')
                {
                     mostSig = test[i]
                     console.log('number',mostSig)
                     i = test.length;
                }
        }

        mostSig = mostSig.toLowerCase()
        if(mostSig === '8' || mostSig === '9' || mostSig === 'a' || mostSig === 'b' || mostSig === 'c' || mostSig === 'c' || mostSig === 'e' || mostSig === 'f')
        {
            console.log('Neg',mostSig)
            console.log('bin',binary)
            let inverted = 0xffffffff - hexNumber
            var twoComp = inverted + 0x01
            console.log(twoComp)
            signed = '-'+twoComp.toString(10)
        }
        
        var text = 'Signed: '+signed+', Unsigned: '+unsigned
        return text
    }

    public hex2Acsii(hexString: string) 
    {
        var hexNumber = this.hexString2hexNumber(hexString);
        var ascii = String.fromCharCode(hexNumber)
        if(!ascii)
         ascii = "No ASCII"
        let str = '0X'+ hexNumber.toString(16);
        str += ' : '+ascii;
        return str;
    }

    public hexString2hexNumber(hexString: string)
    {
        return (parseInt(hexString));
    }

    constructor(public name: string, public index: number) {
        super(null);
            this.name = name.toUpperCase();

            if(name.toUpperCase() === 'R0' ||
               name.toUpperCase() === 'R1' ||
               name.toUpperCase() === 'R2' ||
               name.toUpperCase() === 'R3' ||
               name.toUpperCase() === 'R4' ||
               name.toUpperCase() === 'R5' ||
               name.toUpperCase() === 'R6' ||
               name.toUpperCase() === 'R7' ||
               name.toUpperCase() === 'R8' ||
               name.toUpperCase() === 'R9' ||
               name.toUpperCase() === 'R10' ||
               name.toUpperCase() === 'R11' ||
               name.toUpperCase() === 'R12') 
            {
                  this.fields = [new FieldNode('Binary', 0, 32, this),
                                 new FieldNode('Decimal', 0, 100, this),
                                 new FieldNode('Ascii', 0, 100, this),];
            }
           else if (name.toUpperCase() === 'XPSR' || name.toUpperCase() === 'CPSR') {
               
               this.fields = [
                   new FieldNode('Negative Flag (N)', 31, 1, this),
                   new FieldNode('Zero Flag (Z)', 30, 1, this),
                   new FieldNode('Carry or borrow flag (C)', 29, 1, this),
                   new FieldNode('Overflow Flag (V)', 28, 1, this),
                   new FieldNode('Saturation Flag (Q)', 27, 1, this),
                   new FieldNode('GE', 16, 4, this),
                   new FieldNode('Interrupt Number', 0, 8, this),
                   new FieldNode('ICI/IT', 25, 2, this),
                   new FieldNode('ICI/IT', 10, 6, this),
                   new FieldNode('Thumb State (T)', 24, 1, this)
               ];
           }
           this.currentValue = 0;
           this.currentDecValue = '0';
           this.currentBinaryValue = '0b00';
           this.currentAsciiValue = '0x00 '+'@';
           this.currentNaturalValue = '0x00000000';
    }

    public extractBits(offset: number, width: number): number {
        return extractBits(this.currentValue, offset, width);
    }

    public getTreeItem(): TreeItem | Promise<TreeItem> {
        const state = this.fields && this.fields.length > 0 ?
            (this.expanded ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed)
            : TreeItemCollapsibleState.None;
        
        const item = new TreeItem(this.name, state);
        item.description = this.currentNaturalValue;
        item.contextValue = 'register';

        return item;
    }

    public getChildren(): FieldNode[] {
        return this.fields;
    }

    public setValue(newValue: string) {
        this.currentNaturalValue = newValue;
        const base = this.currentNaturalValue.startsWith('0x') ? 16 : 10;
        this.currentAsciiValue = this.hex2Acsii(newValue);
        this.currentBinaryValue = this.hex2bin(newValue);
        this.currentDecValue = this.hex2Dec(newValue);
        
        
        if (this.name.toUpperCase() === 'CONTROL' || this.name.toUpperCase() === 'XPSR' || 
        this.name.toUpperCase() === 'R0' || 
        this.name.toUpperCase() === 'R1' || 
        this.name.toUpperCase() === 'R2' ||
        this.name.toUpperCase() === 'R3' ||
        this.name.toUpperCase() === 'R4' ||
        this.name.toUpperCase() === 'R5' ||
        this.name.toUpperCase() === 'R6' ||
        this.name.toUpperCase() === 'R7' ||
        this.name.toUpperCase() === 'R8' ||
        this.name.toUpperCase() === 'R9' ||
        this.name.toUpperCase() === 'R10' ||
        this.name.toUpperCase() === 'R11' ||
        this.name.toUpperCase() === 'R12' ||
        this.name.toUpperCase() === 'CPSR') 
        {
            this.currentValue = parseInt(this.currentNaturalValue, base);
            let cv = this.currentValue.toString(16);
            while (cv.length < 8) { cv = '0' + cv; }
            this.currentNaturalValue = '0x' + cv;
            this.currentAsciiValue = this.hex2Acsii(this.currentNaturalValue);
            this.currentBinaryValue = this.hex2bin(this.currentNaturalValue);
            this.currentDecValue = this.hex2Dec(this.currentNaturalValue);
        }
        this.currentValue = parseInt(this.currentNaturalValue, base);
    }

    public getCopyValue(): string {
        return this.currentNaturalValue;
    }

    public getCurrentValue(): number {
        return this.currentValue;
    }

    public _saveState(): NodeSetting[] {
        const settings: NodeSetting[] = [];
        if (this.fields && this.fields.length > 0 && this.expanded) {
            settings.push({ node: this.name, expanded: this.expanded });
        }

        return settings;
    }
}
