
-- Phase 2: Add comprehensive sample data for testing

-- 1. Insert sample bundles
INSERT INTO public.bundles (id, name, summary, status, created_by, leverage_points, tags, objectives, pillars, geography, coherence, ndi_impact, is_approved) VALUES
(gen_random_uuid(), 'Digital Transformation Initiative', 'Comprehensive digital modernization across government services', 'active', (SELECT id FROM auth.users LIMIT 1), 
 '[{"point": "Process Automation", "impact": 85}, {"point": "Data Integration", "impact": 92}]'::jsonb,
 ARRAY['digital', 'transformation', 'automation'],
 ARRAY['Reduce processing time by 60%', 'Improve citizen satisfaction', 'Increase operational efficiency'],
 ARRAY['Technology', 'Process Improvement', 'Citizen Services'],
 ARRAY['National', 'Urban Centers'],
 85, 92.5, true),

(gen_random_uuid(), 'Climate Resilience Program', 'National climate adaptation and mitigation strategy', 'pilot', (SELECT id FROM auth.users LIMIT 1),
 '[{"point": "Green Infrastructure", "impact": 78}, {"point": "Policy Framework", "impact": 65}]'::jsonb,
 ARRAY['climate', 'resilience', 'sustainability'],
 ARRAY['Reduce carbon emissions by 40%', 'Build climate-resilient infrastructure', 'Enhance disaster preparedness'],
 ARRAY['Environment', 'Infrastructure', 'Policy'],
 ARRAY['National', 'Coastal Regions'],
 72, 88.0, false),

(gen_random_uuid(), 'Education Innovation Hub', 'Modern learning platforms and curriculum reform', 'draft', (SELECT id FROM auth.users LIMIT 1),
 '[{"point": "Curriculum Reform", "impact": 70}, {"point": "Technology Integration", "impact": 82}]'::jsonb,
 ARRAY['education', 'innovation', 'technology'],
 ARRAY['Improve learning outcomes', 'Increase digital literacy', 'Enhance teacher capabilities'],
 ARRAY['Education', 'Technology', 'Human Development'],
 ARRAY['National', 'Rural Areas'],
 68, 75.5, false);

-- 2. Insert sample KPIs
INSERT INTO public.kpis (bundle_id, name, current_value, target_value, unit) VALUES
((SELECT id FROM public.bundles WHERE name = 'Digital Transformation Initiative'), 'Processing Time Reduction', 45, 60, '%'),
((SELECT id FROM public.bundles WHERE name = 'Digital Transformation Initiative'), 'Citizen Satisfaction Score', 7.2, 8.5, 'score'),
((SELECT id FROM public.bundles WHERE name = 'Climate Resilience Program'), 'Carbon Emission Reduction', 22, 40, '%'),
((SELECT id FROM public.bundles WHERE name = 'Climate Resilience Program'), 'Green Infrastructure Projects', 15, 50, 'projects'),
((SELECT id FROM public.bundles WHERE name = 'Education Innovation Hub'), 'Digital Literacy Rate', 35, 75, '%'),
((SELECT id FROM public.bundles WHERE name = 'Education Innovation Hub'), 'Teacher Training Completion', 28, 80, '%');

-- 3. Insert sample health metrics for all zones
INSERT INTO public.health_metrics (zone, name, value, target, timestamp) VALUES
('THINK', 'Scenario Completion Rate', 78, 85, NOW() - INTERVAL '1 hour'),
('THINK', 'Analysis Quality Score', 82, 90, NOW() - INTERVAL '2 hours'),
('ACT', 'Bundle Delivery Rate', 65, 80, NOW() - INTERVAL '1 hour'),
('ACT', 'Coordination Efficiency', 71, 85, NOW() - INTERVAL '3 hours'),
('LEARN', 'Knowledge Capture Rate', 88, 90, NOW() - INTERVAL '1 hour'),
('LEARN', 'Lesson Application Score', 76, 85, NOW() - INTERVAL '2 hours'),
('INNOVATE', 'Innovation Success Rate', 42, 60, NOW() - INTERVAL '1 hour'),
('INNOVATE', 'Prototype Completion', 38, 70, NOW() - INTERVAL '4 hours'),
('MONITOR', 'System Stability', 92, 95, NOW() - INTERVAL '30 minutes'),
('MONITOR', 'Alert Response Time', 85, 90, NOW() - INTERVAL '1 hour');

-- 4. Insert sample approvals
INSERT INTO public.approvals (type, title, created_by, assigned_to, status, context_snapshot, due_at) VALUES
('bundle', 'Climate Resilience Program Approval', (SELECT id FROM auth.users LIMIT 1), ARRAY[(SELECT id FROM auth.users LIMIT 1)], 'pending', 
 '{"budget": 15000000, "timeline": "18 months", "risk_level": "medium"}'::jsonb, NOW() + INTERVAL '3 days'),
('strategy', 'Digital Strategy Framework Review', (SELECT id FROM auth.users LIMIT 1), ARRAY[(SELECT id FROM auth.users LIMIT 1)], 'approved',
 '{"impact_score": 85, "alignment": "high", "resources": "adequate"}'::jsonb, NOW() + INTERVAL '1 week'),
('redesign', 'Education System Redesign', (SELECT id FROM auth.users LIMIT 1), ARRAY[(SELECT id FROM auth.users LIMIT 1)], 'revisionRequested',
 '{"scope": "national", "complexity": "high", "stakeholders": 25}'::jsonb, NOW() + INTERVAL '5 days');

-- 5. Insert sample claims
INSERT INTO public.claims (zone, task_id, status, claimed_by, metadata) VALUES
('ACT', (SELECT id FROM public.bundles WHERE name = 'Digital Transformation Initiative'), 'assigned', (SELECT id FROM auth.users LIMIT 1),
 '{"priority": "high", "estimated_hours": 120, "skills_required": ["project_management", "digital_transformation"]}'::jsonb),
('THINK', gen_random_uuid(), 'open', NULL,
 '{"analysis_type": "scenario_modeling", "complexity": "medium", "deadline": "2024-01-15"}'::jsonb),
('LEARN', gen_random_uuid(), 'closed', (SELECT id FROM auth.users LIMIT 1),
 '{"lesson_category": "implementation", "documentation_complete": true, "knowledge_transferred": true}'::jsonb);

-- 6. Insert sample scenarios
INSERT INTO public.scenarios (name, description, created_by, parameters, results, is_baseline) VALUES
('Baseline Economic Model', 'Current economic trajectory with existing policies', (SELECT id FROM auth.users LIMIT 1),
 '{"gdp_growth": 2.5, "inflation": 3.2, "unemployment": 5.8, "investment": 18.5}'::jsonb,
 '{"projected_gdp": 2.7, "job_creation": 150000, "fiscal_impact": "neutral"}'::jsonb, true),
('Accelerated Growth Scenario', 'Economic model with enhanced digital and green investments', (SELECT id FROM auth.users LIMIT 1),
 '{"gdp_growth": 4.2, "inflation": 3.8, "unemployment": 4.2, "investment": 28.5}'::jsonb,
 '{"projected_gdp": 4.5, "job_creation": 285000, "fiscal_impact": "positive"}'::jsonb, false),
('Conservative Scenario', 'Economic model with reduced spending and cautious growth', (SELECT id FROM auth.users LIMIT 1),
 '{"gdp_growth": 1.8, "inflation": 2.1, "unemployment": 6.5, "investment": 12.3}'::jsonb,
 '{"projected_gdp": 1.9, "job_creation": 85000, "fiscal_impact": "stable"}'::jsonb, false);

-- 7. Insert sample lessons
INSERT INTO public.lessons (title, content, source_bundle_id, tags, created_by) VALUES
('Digital Transformation: Stakeholder Engagement', 'Critical importance of early and continuous stakeholder engagement in digital transformation projects. Key finding: 85% of successful implementations had dedicated stakeholder management from day one.',
 (SELECT id FROM public.bundles WHERE name = 'Digital Transformation Initiative'),
 ARRAY['stakeholder_management', 'digital_transformation', 'implementation'], (SELECT id FROM auth.users LIMIT 1)),
('Climate Projects: Community Buy-in', 'Community participation is essential for climate resilience projects. Projects with strong community engagement showed 60% higher success rates and better long-term sustainability.',
 (SELECT id FROM public.bundles WHERE name = 'Climate Resilience Program'),
 ARRAY['community_engagement', 'climate', 'sustainability'], (SELECT id FROM auth.users LIMIT 1)),
('Cross-sector Coordination Challenges', 'Managing coordination across multiple sectors requires dedicated coordination mechanisms. Recommendation: Establish clear governance structures and regular communication protocols.',
 NULL, ARRAY['coordination', 'governance', 'cross_sector'], (SELECT id FROM auth.users LIMIT 1));

-- 8. Insert sample anomalies
INSERT INTO public.anomalies (metric_id, severity, details, acknowledged) VALUES
((SELECT id FROM public.health_metrics WHERE name = 'System Stability' LIMIT 1), 'medium', 
 'System stability dropped below threshold during peak hours. Investigation shows increased load from new digital services rollout.', false),
((SELECT id FROM public.health_metrics WHERE name = 'Innovation Success Rate' LIMIT 1), 'high',
 'Innovation success rate significantly below target. Analysis suggests need for enhanced resource allocation and process improvements.', true),
((SELECT id FROM public.health_metrics WHERE name = 'Bundle Delivery Rate' LIMIT 1), 'low',
 'Minor delay in bundle delivery timeline due to stakeholder coordination issues. Mitigation strategies implemented.', true);
