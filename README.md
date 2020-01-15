# SimpleStruct
A simple tool made for reverse engineers that automatically calculates the correct padding in data structures based on positions of known structure members.

## Features
Easy Input<br />
Auto aligning comments<br />
Supports arrays<br />
Specifiers<br />
Class and struct declaration<br />
Pointers<br />
64 or 32-bit option<br />
Alerts for: typos and errors

## Example Input
32-Bit, Custom name: centity_s, Custom size: 0x204
```cpp
	int eventParam 0x164
	short CurrentVaild 0x0
	char Alive 0x2
	Vector3 origin 0x18
	int flags2 0x38
	int number 0xDC
	int eType 0xE0
	char PlayerPose 0xE4
	int IsAlive 0x1DC
	char Shooting 0xE5
	char Zoomed 0xE6
	unsigned int item 0x16C
	char event[4] 0x17C
	int eventParams 0x19C
	Vector3 angles 0x24
	short WeaponNum 0x1A8
```

## Example Output
```cpp
struct centity_s
{
	short CurrentVaild;		//0x0000
	char Alive;			//0x0002
	char _0x0003[0x15];		//0x0003
	Vector3 origin;			//0x0018
	Vector3 angles;			//0x0024
	char _0x0030[0x8];		//0x0030
	int flags2;			//0x0038
	char _0x003C[0xA0];		//0x003C
	int number;			//0x00DC 
	int eType;			//0x00E0  
	char PlayerPose;		//0x00E4  
	char Shooting;			//0x00E5  
	char Zoomed;			//0x00E6  
	char _0x00E7[0x7D];		//0x00E7
	int eventParam;			//0x0164
	char _0x0168[0x4];		//0x0168
	unsigned int item;		//0x016C
	char _0x0170[0xC];		//0x0170
	char event[4];			//0x017C
	char _0x0180[0x1C];		//0x0180
	int eventParams;		//0x019C
	char _0x01A0[0x8];		//0x01A0
	short WeaponNum;		//0x01A8  
	char _0x01AA[50];		//0x01AA
	int IsAlive;			//0x01DC  
	char _0x01E0[0x24];		//0x01E0
	//size: 0x204
};
```

## Advanced Input
32-Bit, Custom name: ClientEntity
```cpp
	class ClientPlayer *player[18] 0x10
```

## Advanced Output
```cpp
struct ClientEntity
{
    char _0x0000[0x10];                 //0x0000
    class ClientPlayer * player[18];    //0x0010
    //size: 0x0058
};
```