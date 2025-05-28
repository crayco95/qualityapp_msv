from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.parameter_service import ParameterService

parameter_bp = Blueprint("parameter", __name__)

@parameter_bp.route("/create", methods=["POST"])
@jwt_required()
def create_parameter():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden crear parámetros"}), 403

    try:
        data = request.get_json()
        parameter = ParameterService.create_parameter(
            standard_id=data["standard_id"],
            name=data["name"],
            description=data["description"],
            weight=data["weight"],
            parent_id=data.get("parent_id"),
            status=data.get("status", True)
        )

        return jsonify({
            "message": "Parámetro creado exitosamente",
            "parameter": parameter.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except KeyError as e:
        return jsonify({"error": f"Campo requerido faltante: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parameter_bp.route("/list", methods=["GET"])
@jwt_required()
def get_all_parameters():
    try:
        # Esta función necesita ser implementada en el servicio
        return jsonify({
            "message": "Función no implementada aún"
        }), 501
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parameter_bp.route("/standard/<int:standard_id>", methods=["GET"])
@jwt_required()
def get_parameters_by_standard(standard_id):
    try:
        parameters = ParameterService.get_parameters_by_standard(standard_id)
        return jsonify({
            "parameters": [p.to_dict() for p in parameters]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parameter_bp.route("/<int:parameter_id>", methods=["GET"])
@jwt_required()
def get_parameter(parameter_id):
    try:
        parameter = ParameterService.get_parameter_by_id(parameter_id)

        if not parameter:
            return jsonify({"error": "Parámetro no encontrado"}), 404

        return jsonify(parameter.to_dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parameter_bp.route("/<int:parameter_id>", methods=["PUT"])
@jwt_required()
def update_parameter(parameter_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden actualizar parámetros"}), 403

    try:
        data = request.get_json()
        parameter = ParameterService.update_parameter(
            parameter_id=parameter_id,
            name=data.get("name"),
            description=data.get("description"),
            weight=data.get("weight"),
            status=data.get("status")
        )

        if not parameter:
            return jsonify({"error": "Parámetro no encontrado o no se proporcionaron cambios"}), 404

        return jsonify({
            "message": "Parámetro actualizado exitosamente",
            "parameter": parameter.to_dict()
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parameter_bp.route("/<int:parameter_id>", methods=["DELETE"])
@jwt_required()
def delete_parameter(parameter_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden eliminar parámetros"}), 403

    try:
        success = ParameterService.delete_parameter(parameter_id)

        if not success:
            return jsonify({"error": "Parámetro no encontrado"}), 404

        return jsonify({
            "message": "Parámetro eliminado exitosamente"
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500