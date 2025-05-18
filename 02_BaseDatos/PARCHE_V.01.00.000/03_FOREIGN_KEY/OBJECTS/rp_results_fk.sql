-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             18/05/2025      Cesar           se crea llaves foraneas de rp_results FK'S
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================


   
alter table only rp_results add constraint rp_results_rp_assessment
	foreign key (rslt_assmt_id) references rp_assessment(assmt_id);

alter table only rp_results add constraint rp_results_ge_parameters
	foreign key (rslt_param_id) references ge_parameters(param_id);

alter table only rp_results add constraint rp_results_ge_subcategory
	foreign key (rslt_subctg_id) references ge_subcategory(subctg_id);
    

    
