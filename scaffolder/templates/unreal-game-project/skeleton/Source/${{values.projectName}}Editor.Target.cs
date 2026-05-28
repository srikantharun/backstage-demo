// Copyright Team17 Digital Ltd. All Rights Reserved.

using UnrealBuildTool;
using System.Collections.Generic;

public class ${{values.projectName}}EditorTarget : TargetRules
{
    public ${{values.projectName}}EditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V4;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        ExtraModuleNames.AddRange(new string[] { "${{values.projectName}}" });

{%- if values.enableDistributedBuild %}
        // Enable distributed compilation for faster iteration
        bAllowXGE = true;
        bAllowFASTBuild = true;
{%- endif %}
    }
}
