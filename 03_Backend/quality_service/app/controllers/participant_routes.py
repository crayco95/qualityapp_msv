from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.participant_service import ParticipantService

participant_bp = Blueprint("participant", __name__)

# 🔹 Crear un nuevo participante
@participant_bp.route("/register", methods=["POST"])
@jwt_required()
def register_participant():
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden crear participantes"}), 403

    try:
        data = request.json

        # Verificar si el usuario ya es participante del software
        if ParticipantService.check_participant_exists(data["soft_id"], data["usr_id"]):
            return jsonify({"error": "El usuario ya es participante de este software"}), 400

        participant = ParticipantService.create_participant(
            soft_id=data["soft_id"],
            usr_id=data["usr_id"],
            name=data["name"],
            position=data.get("position", ""),
            signature=data.get("signature")
        )

        return jsonify({
            "message": "Participante creado exitosamente",
            "participant": participant.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Obtener lista de participantes
@participant_bp.route("/list", methods=["GET"])
@jwt_required()
def get_participants():
    try:
        participants = ParticipantService.get_all_participants()
        return jsonify({
            "participants": participants
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Obtener participante por ID
@participant_bp.route("/<int:part_id>", methods=["GET"])
@jwt_required()
def get_participant(part_id):
    try:
        participant = ParticipantService.get_participant_by_id(part_id)

        if not participant:
            return jsonify({"error": "Participante no encontrado"}), 404

        return jsonify(participant.to_dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Actualizar participante
@participant_bp.route("/<int:part_id>", methods=["PUT"])
@jwt_required()
def update_participant(part_id):
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Solo administradores y testers pueden actualizar participantes"}), 403

    try:
        data = request.get_json()
        participant = ParticipantService.update_participant(
            participant_id=part_id,
            name=data.get("name"),
            position=data.get("position"),
            signature=data.get("signature")
        )

        if not participant:
            return jsonify({"error": "Participante no encontrado o no se proporcionaron cambios"}), 404

        return jsonify({
            "message": "Participante actualizado exitosamente",
            "participant": participant.to_dict()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Eliminar participante
@participant_bp.route("/<int:part_id>", methods=["DELETE"])
@jwt_required()
def delete_participant(part_id):
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Solo administradores y testers pueden eliminar participantes"}), 403

    try:
        success = ParticipantService.delete_participant(part_id)

        if not success:
            return jsonify({"error": "Participante no encontrado"}), 404

        return jsonify({
            "message": "Participante eliminado exitosamente"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Listar participantes de un software específico
@participant_bp.route("/software/<int:soft_id>", methods=["GET"])
@jwt_required()
def get_participants_by_software(soft_id):
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden consultar participantes"}), 403

    try:
        participants = ParticipantService.get_participants_by_software(soft_id)
        return jsonify({
            "participants": participants
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500