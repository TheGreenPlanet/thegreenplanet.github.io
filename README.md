# SimpleStruct
A simple tool made for reverse engineers that automatically calculates the correct padding in data structures based on positions of known structure members.

**Example Output**
```c++
struct
{
	short CurrentVaild;		//0x0000
	char Alive;				//0x0002
	char _0x0003[0x15];		//0x0003
	Vector3 origin;			//0x0018
	Vector3 angles;			//0x0024
	char _0x0030[0x8];		//0x0030
	int flags2;				//0x0038
	char _0x003C[0xA0];		//0x003C
	int number;				//0x00DC 
	entityType_t eType;		//0x00E0  
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
}centity_s;
```
