-- Seed demo board with separate demo organization
-- Run with: PGPASSWORD= psql "postgresql://mayurbijarniya@localhost:5432/collabboard" -f scripts/seed-demo.sql

DO $$
DECLARE
    demo_org_id TEXT;
    demo_user1_id TEXT;
    demo_user2_id TEXT;
    demo_user3_id TEXT;
BEGIN
    -- Create demo organization (if not exists)
    INSERT INTO "organizations" (id, name, "createdAt", "updatedAt")
    SELECT 'org_demo', 'Demo Organization', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "organizations" WHERE id = 'org_demo');

    -- Get the demo organization ID
    SELECT o.id INTO demo_org_id FROM "organizations" o WHERE o.id = 'org_demo' LIMIT 1;

    -- Create demo users (all new users, don't modify existing accounts)
    INSERT INTO "users" (id, email, name, image, "organizationId", "createdAt", "updatedAt")
    SELECT 'user1_demo', 'mayur@demo.com', 'Mayur', NULL, demo_org_id, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE id = 'user1_demo');

    INSERT INTO "users" (id, email, name, image, "organizationId", "createdAt", "updatedAt")
    SELECT 'user2_demo', 'sarah@demo.com', 'Sarah Chen', NULL, demo_org_id, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE id = 'user2_demo');

    INSERT INTO "users" (id, email, name, image, "organizationId", "createdAt", "updatedAt")
    SELECT 'user3_demo', 'mike@demo.com', 'Mike Johnson', NULL, demo_org_id, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE id = 'user3_demo');

    -- Get the demo user IDs
    SELECT u.id INTO demo_user1_id FROM "users" u WHERE u.id = 'user1_demo' LIMIT 1;
    SELECT u.id INTO demo_user2_id FROM "users" u WHERE u.id = 'user2_demo' LIMIT 1;
    SELECT u.id INTO demo_user3_id FROM "users" u WHERE u.id = 'user3_demo' LIMIT 1;

    -- Check if demo board exists and delete it
    IF EXISTS (SELECT 1 FROM "boards" WHERE id = 'demo') THEN
        DELETE FROM "checklist_items" WHERE "noteId" IN (SELECT id FROM "notes" WHERE "boardId" = 'demo');
        DELETE FROM "notes" WHERE "boardId" = 'demo';
        DELETE FROM "boards" WHERE id = 'demo';
    END IF;

    -- Create demo board
    INSERT INTO "boards" (id, name, description, "isPublic", "organizationId", "createdBy", "createdAt", "updatedAt")
    VALUES (
        'demo',
        'Welcome to CollabBoard!',
        'A demo board showcasing CollabBoard features',
        true,
        demo_org_id,
        demo_user1_id,
        NOW(),
        NOW()
    );

    -- Create notes with specific colors and different users
    INSERT INTO "notes" (id, color, "boardId", "createdBy", "createdAt", "updatedAt")
    VALUES
        ('note1', '#dbeafe', 'demo', demo_user1_id, NOW(), NOW()),
        ('note2', '#dcfce7', 'demo', demo_user2_id, NOW(), NOW()),
        ('note3', '#fef3c7', 'demo', demo_user3_id, NOW(), NOW()),
        ('note4', '#fce7f3', 'demo', demo_user1_id, NOW(), NOW()),
        ('note5', '#f3e8ff', 'demo', demo_user2_id, NOW(), NOW()),
        ('note6', '#ffedd5', 'demo', demo_user3_id, NOW(), NOW());

    -- Note 1 - Getting Started (by Mayur)
    INSERT INTO "checklist_items" (id, content, checked, "order", "noteId", "createdAt", "updatedAt")
    VALUES
        ('cl1', 'Sign up for an account', true, 0, 'note1', NOW(), NOW()),
        ('cl2', 'Create your first board', true, 1, 'note1', NOW(), NOW()),
        ('cl3', 'Add sticky notes', false, 2, 'note1', NOW(), NOW()),
        ('cl4', 'Invite your team', false, 3, 'note1', NOW(), NOW());

    -- Note 2 - Team Standup (by Sarah)
    INSERT INTO "checklist_items" (id, content, checked, "order", "noteId", "createdAt", "updatedAt")
    VALUES
        ('cl5', 'Yesterday''s progress', true, 0, 'note2', NOW(), NOW()),
        ('cl6', 'Today''s goals', false, 1, 'note2', NOW(), NOW()),
        ('cl7', 'Blockers & challenges', false, 2, 'note2', NOW(), NOW());

    -- Note 3 - Project Roadmap (by Mike)
    INSERT INTO "checklist_items" (id, content, checked, "order", "noteId", "createdAt", "updatedAt")
    VALUES
        ('cl8', 'Q1 milestones', true, 0, 'note3', NOW(), NOW()),
        ('cl9', 'Feature planning', true, 1, 'note3', NOW(), NOW()),
        ('cl10', 'Resource allocation', false, 2, 'note3', NOW(), NOW());

    -- Note 4 - Design Sprint (by Mayur)
    INSERT INTO "checklist_items" (id, content, checked, "order", "noteId", "createdAt", "updatedAt")
    VALUES
        ('cl11', 'User research synthesis', true, 0, 'note4', NOW(), NOW()),
        ('cl12', 'Ideation & sketching', true, 1, 'note4', NOW(), NOW()),
        ('cl13', 'Prototyping', false, 2, 'note4', NOW(), NOW());

    -- Note 5 - Sprint Retrospective (by Sarah)
    INSERT INTO "checklist_items" (id, content, checked, "order", "noteId", "createdAt", "updatedAt")
    VALUES
        ('cl14', 'What went well', true, 0, 'note5', NOW(), NOW()),
        ('cl15', 'What could improve', true, 1, 'note5', NOW(), NOW()),
        ('cl16', 'Action items for next sprint', false, 2, 'note5', NOW(), NOW());

    -- Note 6 - Onboarding Checklist (by Mike)
    INSERT INTO "checklist_items" (id, content, checked, "order", "noteId", "createdAt", "updatedAt")
    VALUES
        ('cl17', 'Account setup', true, 0, 'note6', NOW(), NOW()),
        ('cl18', 'Team introductions', true, 1, 'note6', NOW(), NOW()),
        ('cl19', 'Tool access requests', false, 2, 'note6', NOW(), NOW());

    RAISE NOTICE 'Demo board created successfully!';
END $$;
