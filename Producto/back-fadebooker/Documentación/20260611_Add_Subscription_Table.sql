-- Migration for Subscription table (alternative name)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subscription]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.Subscription (
    id INT IDENTITY(1,1) PRIMARY KEY,
    provider_id INT NOT NULL,
    tier_id INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    started_at DATETIME NOT NULL DEFAULT GETDATE(),
    metadata NVARCHAR(MAX) NULL
  );
END
