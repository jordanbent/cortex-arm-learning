# Cortex-ARM Learning

Cortex-ARM Learning is a VSCode Debugger extension intended to be used with ARM Assembly Language programs. 

The debugger is built off of the existing extension [Cortex Debug](https://marketplace.visualstudio.com/items?itemName=marus25.cortex-debug).

Cortex-ARM Learning is equipt with additional UI features that will aid Early-Stage Programmers with the learning of Assembly Langugage and the concepts that are involved. 

## Features

### Build Button
![build](./images/buildbutton.PNG)

### Register View
![RegisterView](./images/registerView.PNG)


### Performance Counter
![counter](./images/counter.png)

### Stack Interface
![Stack](./images/stack.PNG)

### Array Interface
![allcommands](./images/allCommands.png)
![array1](./images/viewArray.png)
![array2](./images/viewArray2.png)
![array3](./images/viewArray3.png)
![array4](./images/viewArray4.png)
![array5](./images/viewArray5.png)
![array6](./images/viewArray6.png)
![array7](./images/viewArray7.png)
![array8](./images/viewArray8.png)
![arrayRes](./images/arrayWindow.png)

### Reference Table


### Other
These features are all in addition to the already existing features of the debugger which include the following:

- Memory Access
- Diassembly Window 

## Setup

### VS Code

### ARM Assembly Project File

[CortexARM Project File](https://github.com/jordanbent/CortexARM-ProjectFile)

### Environment

In C:/
VSARM
[minGW](https://osdn.net/projects/mingw/downloads/68260/mingw-get-setup.exe/)
Download Into C:\VSARM
On command line:

```bash
C:\>setx PATH "C:\VSARM\minGW\bin"
```
[armcc](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)
Download :gcc-arm-none-eabi-9-2019-q4-major-win32.exe
Into C:\VSARM
Rename folder armcc

[Jlink](segger.com/downloads/jlink/#J-LinkSoftwareAndDocumentationPack)
Download J-Link Software and Documentation Pack


Command Line

```bash
C:\>setx PATH "C:\VSARM\armcc\bin"
```
f1 - Settings JSON : add 
"cortex-debug.armToolchainPath": "${env:VSARM}\\armcc\\bin\\",
"cortex-debug.JLinkGDBServerPath": "${env:VSARM}\\JLink\\JLinkGDBServer.exe",

[tutorial](https://hbfsrobotics.com/blog/configuring-vs-code-arm-development-stm32cubemx)

### Board
Currently Setup for STM32F411 Cortex M-4 core 
If have a different version of the board, find .svd file and all to .ignore file and in vscode folder change launch file for project.

## Usage


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments
This extension is built upon Jurzitza's (WebFreak) code-debug extension (https://github.com/WebFreak001/code-debug). His project provided an excellent base for GDB MI parsing and interaction.