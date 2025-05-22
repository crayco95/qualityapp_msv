-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             18/05/2025      Cesar           se crea llaves foraneas de rp_assessment FK'S
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================


   
alter table only rp_assessment add constraint rp_assessment_ge_software 
	foreign key (assmt_software_id) references ge_software(soft_id);
    
alter table only rp_assessment add constraint rp_assessment_ge_standards
	foreign key (assmt_standard_id) references ge_standards(strnd_id);
	
alter table only rp_assessment add constraint rp_assessment_ge_parameters
	foreign key (assmt_param_id) references ge_parameters(param_id);
	
alter table only rp_assessment add constraint rp_assessment_ge_clasification
	foreign key (assmt_classification_id) references ge_clasification(clsf_id);
    
