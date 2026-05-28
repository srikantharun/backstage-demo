// Copyright Team17 Digital Ltd. All Rights Reserved.

using UnrealBuildTool;
using System.Collections.Generic;

public class ${{values.projectName}}Target : TargetRules
{
    public ${{values.projectName}}Target(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V4;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        ExtraModuleNames.AddRange(new string[] { "${{values.projectName}}" });

{%- if values.buildConfiguration == "Shipping" %}
        // Shipping optimizations
        bUseLoggingInShipping = false;
        bUseChecksInShipping = false;
{%- endif %}

{%- if values.enableDistributedBuild %}
        // Enable Unreal Build Accelerator (UE5.3+) or FASTBuild
        bAllowXGE = true;
        bAllowFASTBuild = true;
{%- endif %}
    }
}
