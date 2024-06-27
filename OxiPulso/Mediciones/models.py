from OxiPulso import db
import pandas as pd
import os
from OxiPulso.Autenticacion.models import Usuario
from flask import send_file

class Mediciones(db.Model):
    _tablename_ = "mediciones"
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    bpm = db.Column(db.Integer, nullable=False)
    spo2 = db.Column(db.Integer, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora = db.Column(db.Time, nullable=False)
    usuario = db.relationship('Usuario', backref=db.backref('mediciones', lazy=True))


    def __init__(self, usuario_id, bpm, spo2, fecha, hora):
        self.usuario_id = usuario_id
        self.bpm = bpm
        self.spo2 = spo2
        self.fecha = fecha
        self.hora = hora
    
    def __repr__(self):
        return f"BPM: {self.bpm}\nSPO2: {self.spo2}\nFecha: {self.fecha}\nHora: {self.hora}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'bpm': self.bpm,
            'spo2': self.spo2,
            'fecha': self.fecha.isoformat(),
            'hora': str(self.hora)
        }
    
    def to_dict_admon(self):
        return {
            'id': self.id,
            'usuario_nombre':self.usuario.nombre,
            'bpm': self.bpm,
            'spo2': self.spo2,
            'fecha': self.fecha.isoformat(),

        }

    
    @classmethod
    def obtener_datos(cls, id):
        datos = cls.query.filter_by(usuario_id=id).all()
        datos_dict = [dato.to_dict() for dato in datos]
        print(datos_dict)
        return datos_dict
        
    @classmethod
    def obtener_datos_admon(cls):
        datos = cls.query.all()
        datos_dict_admon = [dato.to_dict_admon() for dato in datos]
        print(datos_dict_admon)
        return datos_dict_admon

    
    @classmethod
    def descargar_csv(cls, usuario_id):
        usuario = Usuario.query.filter_by(id=usuario_id).first()
        
        if not usuario:
            return "Usuario no encontrado", 404
        
        datos = db.session.query(Usuario, Mediciones).join(
            Mediciones, Usuario.id == Mediciones.usuario_id
        ).with_entities(
            Usuario.nombre, Mediciones.bpm, Mediciones.spo2, Mediciones.hora, Mediciones.fecha
        ).filter(
            Usuario.id == usuario_id
        ).all()

        df = pd.DataFrame(datos, columns=['Nombre', 'BPM', 'SPO2', 'Hora', 'Fecha'])

        carpeta = 'archivos'
        
        if not os.path.exists(carpeta):
            os.makedirs(carpeta)

        ruta = os.path.join(carpeta, f"{usuario.nombre}.csv")

        if not os.path.exists(ruta):
            df.to_csv(ruta, index=False)
        else:
            df.to_csv(ruta, mode='a', header=False, index=False)

        print("Se descargó")
        return send_file(ruta, as_attachment=True)
        
    @classmethod
    def descargar_csv_all(cls):
        datos = db.session.query(Usuario, Mediciones).join(
            Mediciones, Usuario.id == Mediciones.usuario_id
        ).with_entities(
            Usuario.nombre, Mediciones.bpm, Mediciones.spo2, Mediciones.hora, Mediciones.fecha
        ).all()

        df = pd.DataFrame(datos, columns=['Nombre', 'BPM', 'SPO2', 'Hora', 'Fecha'])

        carpeta = 'archivos'
        if not os.path.exists(carpeta):
            os.makedirs(carpeta)

        ruta = os.path.join(carpeta, "todos_los_datos.csv")

        if not os.path.exists(ruta):
            df.to_csv(ruta, index=False)
        else:
            df.to_csv(ruta, mode='a', header=False, index=False)

        print("Se descargó")
        return send_file(ruta, as_attachment=True)