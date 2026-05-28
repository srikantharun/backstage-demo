// Copyright Team17 Digital Ltd. All Rights Reserved.

using UnrealBuildTool;

public class ${{values.projectName}} : ModuleRules
{
    public ${{values.projectName}}(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new string[] {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore"
        });

        PrivateDependencyModuleNames.AddRange(new string[] {
            "Slate",
            "SlateCore"
        });

        // Team17 standard: Enable additional runtime checks in non-shipping builds
        if (Target.Configuration != UnrealTargetConfiguration.Shipping)
        {
            PublicDefinitions.Add("TEAM17_ENABLE_RUNTIME_CHECKS=1");
        }
        else
        {
            PublicDefinitions.Add("TEAM17_ENABLE_RUNTIME_CHECKS=0");
        }

{%- if values.enableDistributedBuild %}
        // Distributed build optimization
        bUseUnity = true;
        MinSourceFilesForUnityBuildOverride = 8;
{%- endif %}
    }
}
