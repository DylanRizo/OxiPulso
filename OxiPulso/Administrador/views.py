from flask import (
    render_template,
    Blueprint,
    request,
    jsonify,
    session,
    redirect,
    url_for 
)
from OxiPulso.Mediciones.models import Mediciones
from OxiPulso.Autenticacion.models import Usuario
from .estadisticas import basicos


administrador = Blueprint('administrador', __name__)

@administrador.route('/administrador/inicio')
def inicio():
    return render_template("administrador/admonvista.html")

@administrador.route('/administrador/usuarios')
def obtener_usuarios():
    usuarios = Usuario.obtener_datos_admon()  
    return jsonify(success=True, usuarios=usuarios)

@administrador.route('/administrador/mediciones', methods=['GET', 'POST'])
def obtener_mediciones():
    if request.method == 'POST':
        user = request.form.get('usuario')
        usuario = Usuario.query.filter_by(usuario=user).first()
        usuario_id = usuario.id
        print(usuario_id)
        mediciones = Mediciones.obtener_datos(id=usuario_id)
        return jsonify(success=True, mediciones=mediciones)
    else:
        print("hola")
        mediciones = Mediciones.obtener_datos_admon() 
        return jsonify(success=True, mediciones=mediciones)
    
@administrador.route('/admon/mediciones_vista')
def mediciones_vista():
    return render_template("administrador/mediciones.html")

@administrador.route('/admon/usuarios_vista')
def usuarios_vista():
    return render_template("administrador/usuarios.html")

@administrador.route('/administrador/descarga/mediciones')
def descargar_datos_medicion():
    usuario_id = session.get('usuario_id')
    if usuario_id:
        #return render_template("mediciones/historial.html", mediciones=mediciones)
        return Mediciones.obtener_datos(id=usuario_id)
    else:
         return Mediciones.descargar_csv_all()
    

@administrador.route('/administrador/descarga/usuarios')
def descargar_datos_usuarios():
    usuario_id = session.get('usuario_id')
    if usuario_id:
        #return render_template("mediciones/historial.html", mediciones=mediciones)
        return Usuario.descargar_csv(id=usuario_id)
    else:
        return Usuario.descargar_csv_all()    
    
@administrador.route('/administrador/estadisticas')
def estadisticas():
    (
        bpm_max_data,
        bpm_min_data,
        spo2_max_data,
        spo2_min_data,
        timeline_base64,
        barras_base64,
    ) = basicos()

    return render_template(
        'administrador/estadisticas.html',
        bpm_max_data=bpm_max_data,
        bpm_min_data=bpm_min_data,
        spo2_max_data=spo2_max_data,
        spo2_min_data=spo2_min_data,
         timeline_base64=timeline_base64,
        barras_base64=barras_base64
    )