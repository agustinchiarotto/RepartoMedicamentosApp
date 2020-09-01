//Casos de prueba

//Cargas de Empresa

[
  {
    "_id": "581289790e7cb2095ae4a0e8",
    "nombre": "Empresa-1",
    "cuit": "21-1547",
    "dir": "San Martin",
    "numero": "1589",
    "tel": "2996258741",
    "__v": 1,
    "plantas": []
  },
  {
    "_id": "581289a60e7cb2095ae4a0e9",
    "nombre": "Empresa-2",
    "cuit": "54-7884",
    "dir": "Los Alerces",
    "numero": "2004",
    "tel": "2994045874",
    "__v": 0,
    "plantas": []
  }
]




//----------------------- PLANTA + ACTUALIZAR EMPRESA -------------------------------------------------------------

//Cargas de Plantas y ACTUALIZACION de EMPRESA
{
  "nombre": "Planta-1" ,
  "ubicacion": "Ubicacion-1" ,
  "responsable": "Jorge",
  "contacto":"2996345877",
  "empresa": "581289790e7cb2095ae4a0e8"
}

//Luego de haber cargado la planta, tenemos que se actualiza el atributo "plantas" de Empresa. Obtenemos
{
    "_id": "581289790e7cb2095ae4a0e8",
    "nombre": "Empresa-1",
    "cuit": "21-1547",
    "dir": "San Martin",
    "numero": "1589",
    "tel": "2996258741",
    "__v": 1,
    "plantas": [
      "58128ad13c35b40c1fbc8238"
    ]
}


//----------------------- PROYECTO -------------------------------------------------------------

  
//Carga de 2 Proyectos. Se utiliza la misma empresa
{
  "nombre": "Proyecto-1",
  "fecha": "2007-02-21",
  "descripcion": "Este proyecto se tratara de ...",
  "empresa":"581289790e7cb2095ae4a0e8"
}

{
  "nombre": "Proyecto-2",
  "fecha": "2009-07-30",
  "descripcion": "Este proyecto se tratara de ...",
  "empresa":"581289790e7cb2095ae4a0e8"
}

//Obtenemos

[
{
    "_id": "58128dbb23e3c40d0f62be95",
    "nombre": "Proyecto-1",
    "fecha": "2007-02-21T00:00:00.000Z",
    "descripcion": "Este proyecto se tratara de ...",
    "empresa": "581289790e7cb2095ae4a0e8",
    "__v": 0,
    "oat_regs": [],
    "contratos": []
  },
  {
    "_id": "58128e37aff8a00d8b6176b1",
    "nombre": "Proyecto-2",
    "fecha": "2009-07-30T00:00:00.000Z",
    "descripcion": "Este proyecto se tratara de ...",
    "empresa": "581289790e7cb2095ae4a0e8",
    "__v": 0,
    "oat_regs": [],
    "contratos": []
  }
]


//----------------------- CONTRATO + ACTUALIZAR PROYECTO-------------------------------------------------------------

//Cargamos un contrato al PROYECTO-2
{
  "numero": "Contrato-1",
  "fecha": "2009-07-30",
  "proyecto":"58128e37aff8a00d8b6176b1"
}

//Vemos que se actualizo correctamente el PROYECTO
{
    "_id": "58128e37aff8a00d8b6176b1",
    "nombre": "Proyecto-2",
    "fecha": "2009-07-30T00:00:00.000Z",
    "descripcion": "Este proyecto se tratara de ...",
    "empresa": "581289790e7cb2095ae4a0e8",
    "__v": 1,
    "oat_regs": [],
    "contratos": [
      "581290960c55900e385a1ad1"
    ]
}


//----------------------- OAT_REG + ACTUALIZAR PROYECTO-------------------------------------------------------------


//Cargamos un oat_reg

{
  "numero": "OAT_REG-1",
  "fechaCreacion":"2009-04-12",
  "fechaRealizacion": "2009-04-25",
  "descripcion": "Se debe realizar ..." ,
  "planta": "58128ad13c35b40c1fbc8238",
  "proyecto": "58128e37aff8a00d8b6176b1"
}


//Vemos que se actualizo correctamente el Proyecto
{
    "_id": "58128e37aff8a00d8b6176b1",
    "nombre": "Proyecto-2",
    "fecha": "2009-07-30T00:00:00.000Z",
    "descripcion": "Este proyecto se tratara de ...",
    "empresa": "581289790e7cb2095ae4a0e8",
    "__v": 3,
    "oat_regs": [
      "581292a190a93c0e8c74aab1"
    ],
    "contratos": [
      "581290960c55900e385a1ad1",
      "5812929190a93c0e8c74aab0"
    ]
  }
